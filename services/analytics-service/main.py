from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import uvicorn
import json
import datetime
import random
import time
from collections import defaultdict

app = FastAPI(title="ATP Analytics Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3100"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo
analytics_data = defaultdict(list)
metrics = {}

# Data models
class AnalyticsEvent(BaseModel):
    event_type: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    properties: Dict = {}
    timestamp: Optional[str] = None

class MetricQuery(BaseModel):
    metric_name: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    filters: Dict = {}

# Helper functions
def generate_sample_data():
    """Generate sample analytics data"""
    events = ['page_view', 'listing_view', 'search', 'registration', 'login', 'listing_created', 'payment_completed']
    
    for i in range(100):
        event_type = random.choice(events)
        timestamp = datetime.datetime.now() - datetime.timedelta(days=random.randint(0, 30))
        
        event = {
            'event_type': event_type,
            'user_id': f'user_{random.randint(1, 50)}',
            'session_id': f'session_{random.randint(1, 100)}',
            'timestamp': timestamp.isoformat(),
            'properties': {
                'page': random.choice(['/home', '/listings', '/profile', '/search']),
                'user_agent': 'Mozilla/5.0...',
                'referrer': random.choice(['direct', 'google.com', 'facebook.com']),
                'device_type': random.choice(['desktop', 'mobile', 'tablet'])
            }
        }
        
        if event_type == 'listing_view':
            event['properties']['listing_id'] = f'aircraft_{random.randint(1, 20)}'
            event['properties']['category'] = random.choice(['commercial', 'private', 'helicopter'])
        
        if event_type == 'search':
            event['properties']['query'] = random.choice(['boeing', 'airbus', 'gulfstream', 'cessna'])
            event['properties']['results_count'] = random.randint(0, 50)
        
        if event_type == 'payment_completed':
            event['properties']['amount'] = random.randint(500, 50000)
            event['properties']['currency'] = 'USD'
        
        analytics_data['events'].append(event)

def calculate_metrics():
    """Calculate various metrics from analytics data"""
    events = analytics_data.get('events', [])
    
    # Basic counts
    metrics['total_events'] = len(events)
    metrics['unique_users'] = len(set(e['user_id'] for e in events if e.get('user_id')))
    metrics['unique_sessions'] = len(set(e['session_id'] for e in events if e.get('session_id')))
    
    # Event type breakdown
    event_counts = defaultdict(int)
    for event in events:
        event_counts[event['event_type']] += 1
    metrics['events_by_type'] = dict(event_counts)
    
    # Device breakdown
    device_counts = defaultdict(int)
    for event in events:
        device = event.get('properties', {}).get('device_type', 'unknown')
        device_counts[device] += 1
    metrics['devices'] = dict(device_counts)
    
    # Page views
    page_counts = defaultdict(int)
    for event in events:
        if event['event_type'] == 'page_view':
            page = event.get('properties', {}).get('page', 'unknown')
            page_counts[page] += 1
    metrics['popular_pages'] = dict(page_counts)
    
    # Revenue metrics
    revenue_events = [e for e in events if e['event_type'] == 'payment_completed']
    total_revenue = sum(e.get('properties', {}).get('amount', 0) for e in revenue_events)
    metrics['revenue'] = {
        'total': total_revenue,
        'transactions': len(revenue_events),
        'average_order_value': total_revenue / len(revenue_events) if revenue_events else 0
    }
    
    # Time-based metrics (last 7 days)
    seven_days_ago = datetime.datetime.now() - datetime.timedelta(days=7)
    recent_events = [
        e for e in events 
        if datetime.datetime.fromisoformat(e['timestamp']) > seven_days_ago
    ]
    
    metrics['last_7_days'] = {
        'events': len(recent_events),
        'unique_users': len(set(e['user_id'] for e in recent_events if e.get('user_id'))),
        'page_views': len([e for e in recent_events if e['event_type'] == 'page_view']),
        'conversions': len([e for e in recent_events if e['event_type'] == 'payment_completed'])
    }

# Routes

@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "timestamp": datetime.datetime.now().isoformat(),
        "service": "analytics-service",
        "version": "1.0.0",
        "events": len(analytics_data.get('events', []))
    }

@app.get("/api/test")
async def test_endpoint():
    return {
        "success": True,
        "data": {
            "message": "ATP Analytics Service is working!",
            "timestamp": datetime.datetime.now().isoformat(),
            "events": len(analytics_data.get('events', [])),
            "metrics": len(metrics)
        }
    }

@app.post("/api/events")
async def track_event(event: AnalyticsEvent):
    """Track a new analytics event"""
    try:
        if not event.timestamp:
            event.timestamp = datetime.datetime.now().isoformat()
        
        event_data = event.dict()
        analytics_data['events'].append(event_data)
        
        # Recalculate metrics
        calculate_metrics()
        
        print(f"📊 Event tracked: {event.event_type} for user {event.user_id}")
        
        return {
            "success": True,
            "data": event_data,
            "message": "Event tracked successfully"
        }
    
    except Exception as e:
        print(f"❌ Error tracking event: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to track event")

@app.get("/api/metrics")
async def get_metrics():
    """Get calculated metrics"""
    calculate_metrics()
    
    return {
        "success": True,
        "data": metrics
    }

@app.get("/api/metrics/{metric_name}")
async def get_specific_metric(metric_name: str):
    """Get a specific metric"""
    calculate_metrics()
    
    if metric_name not in metrics:
        raise HTTPException(status_code=404, detail="Metric not found")
    
    return {
        "success": True,
        "data": {
            "metric": metric_name,
            "value": metrics[metric_name]
        }
    }

@app.get("/api/dashboard")
async def get_dashboard_data():
    """Get data for analytics dashboard"""
    calculate_metrics()
    
    dashboard_data = {
        "overview": {
            "total_events": metrics.get('total_events', 0),
            "unique_users": metrics.get('unique_users', 0),
            "unique_sessions": metrics.get('unique_sessions', 0),
            "total_revenue": metrics.get('revenue', {}).get('total', 0)
        },
        "recent_activity": metrics.get('last_7_days', {}),
        "top_events": metrics.get('events_by_type', {}),
        "device_breakdown": metrics.get('devices', {}),
        "popular_pages": metrics.get('popular_pages', {}),
        "revenue_stats": metrics.get('revenue', {}),
        "updated_at": datetime.datetime.now().isoformat()
    }
    
    return {
        "success": True,
        "data": dashboard_data
    }

@app.get("/api/events")
async def get_events(
    limit: int = 100,
    event_type: Optional[str] = None,
    user_id: Optional[str] = None
):
    """Get analytics events with optional filtering"""
    events = analytics_data.get('events', [])
    
    # Apply filters
    if event_type:
        events = [e for e in events if e['event_type'] == event_type]
    
    if user_id:
        events = [e for e in events if e.get('user_id') == user_id]
    
    # Sort by timestamp (newest first)
    events = sorted(events, key=lambda x: x['timestamp'], reverse=True)
    
    # Limit results
    events = events[:limit]
    
    return {
        "success": True,
        "data": {
            "events": events,
            "total": len(events)
        }
    }

@app.post("/api/reports/generate")
async def generate_report(query: MetricQuery):
    """Generate a custom analytics report"""
    try:
        events = analytics_data.get('events', [])
        
        # Apply date filters if provided
        if query.start_date:
            start = datetime.datetime.fromisoformat(query.start_date)
            events = [e for e in events if datetime.datetime.fromisoformat(e['timestamp']) >= start]
        
        if query.end_date:
            end = datetime.datetime.fromisoformat(query.end_date)
            events = [e for e in events if datetime.datetime.fromisoformat(e['timestamp']) <= end]
        
        # Apply custom filters
        for key, value in query.filters.items():
            if key == 'event_type':
                events = [e for e in events if e['event_type'] == value]
            elif key == 'user_id':
                events = [e for e in events if e.get('user_id') == value]
        
        # Generate report based on metric name
        if query.metric_name == 'user_activity':
            user_activity = defaultdict(int)
            for event in events:
                if event.get('user_id'):
                    user_activity[event['user_id']] += 1
            
            report_data = dict(user_activity)
        
        elif query.metric_name == 'daily_events':
            daily_counts = defaultdict(int)
            for event in events:
                date = datetime.datetime.fromisoformat(event['timestamp']).date().isoformat()
                daily_counts[date] += 1
            
            report_data = dict(daily_counts)
        
        else:
            report_data = {"message": f"Report for {query.metric_name} not implemented"}
        
        return {
            "success": True,
            "data": {
                "metric": query.metric_name,
                "filters": query.filters,
                "period": {
                    "start": query.start_date,
                    "end": query.end_date
                },
                "results": report_data,
                "total_events": len(events)
            }
        }
    
    except Exception as e:
        print(f"❌ Error generating report: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate report")

if __name__ == "__main__":
    print("🚀 ATP Analytics Service starting...")
    print("📊 Health check: http://localhost:3004/health")
    print("🧪 Test endpoint: http://localhost:3004/api/test")
    print("📈 Dashboard: http://localhost:3004/api/dashboard")
    print("📋 Events: http://localhost:3004/api/events")
    
    # Generate sample data on startup
    generate_sample_data()
    calculate_metrics()
    print(f"📊 Sample data generated: {len(analytics_data['events'])} events")
    
    uvicorn.run(app, host="0.0.0.0", port=3004)
