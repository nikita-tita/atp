package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Structures
type HealthResponse struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Service   string    `json:"service"`
	Version   string    `json:"version"`
}

type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
	Error   string      `json:"error,omitempty"`
}

type AircraftVerificationRequest struct {
	AircraftID     string `json:"aircraftId"`
	SerialNumber   string `json:"serialNumber"`
	Model          string `json:"model"`
	Manufacturer   string `json:"manufacturer"`
	YearBuilt      int    `json:"yearBuilt"`
	RegistrationNumber string `json:"registrationNumber"`
}

type VerificationResult struct {
	ID                 string    `json:"id"`
	AircraftID         string    `json:"aircraftId"`
	Status             string    `json:"status"`
	FAAStatus          string    `json:"faaStatus"`
	FAARegistrationData map[string]interface{} `json:"faaRegistrationData,omitempty"`
	DocumentsVerified  bool      `json:"documentsVerified"`
	ComplianceScore    int       `json:"complianceScore"`
	LastVerified       time.Time `json:"lastVerified"`
	ExpiresAt          time.Time `json:"expiresAt"`
	Notes              string    `json:"notes,omitempty"`
}

// In-memory storage for demo
var verificationResults = make(map[string]*VerificationResult)

// Middleware
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		log.Printf("%s %s %s", r.Method, r.RequestURI, r.RemoteAddr)
		next.ServeHTTP(w, r)
		log.Printf("Completed in %s", time.Since(start))
	})
}

func JSONMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

// Handlers
func HealthHandler(w http.ResponseWriter, r *http.Request) {
	response := HealthResponse{
		Status:    "OK",
		Timestamp: time.Now(),
		Service:   "verification-service",
		Version:   "1.0.0",
	}
	
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func VerifyAircraftHandler(w http.ResponseWriter, r *http.Request) {
	var req AircraftVerificationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response := APIResponse{
			Success: false,
			Error:   "Invalid request body",
		}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Validate required fields
	if req.AircraftID == "" || req.SerialNumber == "" {
		response := APIResponse{
			Success: false,
			Error:   "AircraftID and SerialNumber are required",
		}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Simulate FAA verification (in real implementation, would call FAA API)
	faaStatus := simulateFAAVerification(req)
	
	// Create verification result
	result := &VerificationResult{
		ID:         fmt.Sprintf("ver-%d", time.Now().Unix()),
		AircraftID: req.AircraftID,
		Status:     "verified",
		FAAStatus:  faaStatus,
		FAARegistrationData: map[string]interface{}{
			"registration":  req.RegistrationNumber,
			"manufacturer":  req.Manufacturer,
			"model":        req.Model,
			"year":         req.YearBuilt,
			"serialNumber": req.SerialNumber,
		},
		DocumentsVerified: true,
		ComplianceScore:   calculateComplianceScore(req),
		LastVerified:      time.Now(),
		ExpiresAt:         time.Now().AddDate(1, 0, 0), // Valid for 1 year
		Notes:            "Verification completed successfully",
	}

	// Store result
	verificationResults[result.ID] = result

	log.Printf("✅ Aircraft verified: %s (Score: %d)", req.AircraftID, result.ComplianceScore)

	response := APIResponse{
		Success: true,
		Data:    result,
		Message: "Aircraft verification completed",
	}
	
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func GetVerificationHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	verificationID := vars["id"]

	result, exists := verificationResults[verificationID]
	if !exists {
		response := APIResponse{
			Success: false,
			Error:   "Verification not found",
		}
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(response)
		return
	}

	response := APIResponse{
		Success: true,
		Data:    result,
	}
	
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func ListVerificationsHandler(w http.ResponseWriter, r *http.Request) {
	results := make([]*VerificationResult, 0, len(verificationResults))
	for _, result := range verificationResults {
		results = append(results, result)
	}

	response := APIResponse{
		Success: true,
		Data: map[string]interface{}{
			"verifications": results,
			"total":        len(results),
		},
	}
	
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func TestHandler(w http.ResponseWriter, r *http.Request) {
	response := APIResponse{
		Success: true,
		Data: map[string]interface{}{
			"message":       "ATP Verification Service is working!",
			"timestamp":     time.Now(),
			"verifications": len(verificationResults),
		},
	}
	
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// Helper functions
func simulateFAAVerification(req AircraftVerificationRequest) string {
	// In real implementation, this would call the FAA API
	// For demo, return based on registration number format
	if len(req.RegistrationNumber) >= 4 && req.RegistrationNumber[:1] == "N" {
		return "VALID"
	}
	return "PENDING"
}

func calculateComplianceScore(req AircraftVerificationRequest) int {
	score := 60 // Base score
	
	if req.RegistrationNumber != "" {
		score += 10
	}
	if req.SerialNumber != "" {
		score += 10
	}
	if req.YearBuilt > 1980 {
		score += 10
	}
	if req.Manufacturer != "" {
		score += 10
	}
	
	return score
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3002"
	}

	router := mux.NewRouter()

	// Middleware
	router.Use(LoggingMiddleware)
	router.Use(JSONMiddleware)

	// Routes
	router.HandleFunc("/health", HealthHandler).Methods("GET")
	router.HandleFunc("/api/test", TestHandler).Methods("GET")
	
	// Verification endpoints
	router.HandleFunc("/api/verify", VerifyAircraftHandler).Methods("POST")
	router.HandleFunc("/api/verifications/{id}", GetVerificationHandler).Methods("GET")
	router.HandleFunc("/api/verifications", ListVerificationsHandler).Methods("GET")

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000", "http://localhost:3100"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	handler := c.Handler(router)

	log.Printf("🚀 ATP Verification Service starting on port %s", port)
	log.Printf("📊 Health check: http://localhost:%s/health", port)
	log.Printf("🧪 Test endpoint: http://localhost:%s/api/test", port)
	log.Printf("✈️  Verification endpoint: http://localhost:%s/api/verify", port)

	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatal("Server failed to start:", err)
	}
} 