# Production Dockerfile for Verification Service
FROM golang:1.21-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
RUN apk add --no-cache git ca-certificates

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags="-w -s" -o verification-service ./cmd/main.go

# Production stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates wget

# Create non-root user
RUN addgroup -g 1001 -S golang && \
    adduser -S golang -u 1001 -G golang

# Set working directory
WORKDIR /app

# Copy binary from builder stage
COPY --from=builder /app/verification-service .

# Create logs directory
RUN mkdir -p /var/log/verification-service && \
    chown -R golang:golang /var/log/verification-service

# Change ownership
RUN chown -R golang:golang /app

# Switch to non-root user
USER golang

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3002/health || exit 1

# Start the application
CMD ["./verification-service"] 