"""
🌱 KISANSETU Standalone Python Backend Server (Standard Library)
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
from datetime import datetime

PORT = 8001

class KISANBackendHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/" or path == "/health":
            self._set_headers(200)
            response = {"status": "ONLINE", "server": "KISANSETU Python API Server", "port": PORT}
        
        elif path == "/api/weather/forecast":
            self._set_headers(200)
            response = {
                "current": {"temp": "29°C", "humidity": "84%", "rainfall": "18 mm", "disease_risk": "CRITICAL"},
                "forecast": [
                    {"day": "Today", "temp": "29°C", "humidity": "84%", "rain": "18 mm", "risk": "Critical"},
                    {"day": "Mon", "temp": "30°C", "humidity": "82%", "rain": "12 mm", "risk": "Critical"},
                    {"day": "Tue", "temp": "31°C", "humidity": "78%", "rain": "5 mm", "risk": "High"}
                ]
            }

        elif path == "/api/gis/hotspots":
            self._set_headers(200)
            response = [
                {"id": "MAP-1", "village": "Rampur", "lat": 29.6857, "lng": 76.9905, "crop": "Rice & Tomato", "reports": 23, "main_issue": "Early Blight", "risk_score": 86},
                {"id": "MAP-2", "village": "Shivpur", "lat": 29.7120, "lng": 77.0150, "crop": "Tomato", "reports": 14, "main_issue": "Late Blight", "risk_score": 72}
            ]

        elif path == "/api/expert/cases":
            self._set_headers(200)
            response = [
                {"id": "EXP-881", "farmer": "Rajesh Kumar", "field": "Field A", "crop": "Rice", "ai_diagnosis": "Rice Brown Spot", "confidence": 64.0, "status": "PENDING_EXPERT"},
                {"id": "EXP-882", "farmer": "Sunil Verma", "field": "North Plot", "crop": "Tomato", "ai_diagnosis": "Early Blight", "confidence": 91.0, "status": "LAB_REFERRED"}
            ]

        elif path == "/api/reports/summary":
            self._set_headers(200)
            response = {
                "total_reports": 12450,
                "high_risk": 1240,
                "hotspots": 86,
                "validated_pct": 74.0
            }

        else:
            self._set_headers(404)
            response = {"error": "Endpoint not found"}

        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else "{}"
        
        try:
            payload = json.loads(body)
        except Exception:
            payload = {}

        if path == "/api/scans/analyze":
            crop = payload.get("crop", "tomato").capitalize()
            self._set_headers(200)
            response = {
                "scan_id": "SCN-99824",
                "crop": crop,
                "predicted_disease": "Early Blight (अगेती झुलसा)",
                "scientific_name": "Alternaria solani",
                "confidence": 91.0,
                "risk_level": "HIGH",
                "symptoms": [
                    "Brown concentric circular lesions on leaves",
                    "Yellowing halo around spots",
                    "Defoliation pattern"
                ],
                "recommendation": "Inspect additional plants and confirm symptoms before treatment."
            }

        elif path == "/api/plants/recognize":
            self._set_headers(200)
            response = {
                "id": "plant_tomato",
                "common_name": "Tomato (टमाटर)",
                "botanical_name": "Solanum lycopersicum",
                "family": "Solanaceae",
                "type": "Fruit Crop",
                "confidence": 96.0,
                "status": "CULTIVATED CROP"
            }

        elif path == "/api/risk/calculate":
            self._set_headers(200)
            response = {
                "composite_risk_score": 82,
                "risk_level": "CRITICAL",
                "explanation": ["High humidity", "Recent rainfall", "Pest trap count rise"]
            }

        else:
            self._set_headers(404)
            response = {"error": "Endpoint not found"}

        self.wfile.write(json.dumps(response).encode('utf-8'))

def run():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, KISANBackendHandler)
    print(f"[*] KISANSETU Python Backend API Server running on port {PORT}...")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
