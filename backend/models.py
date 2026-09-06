"""
🌱 KISANSETU Database Models (Section 25 Schema)
"""

from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # farmer, extension, expert, official
    phone = Column(String, nullable=False)
    language = Column(String, default="hi")
    location = Column(String)

    farms = relationship("Farm", back_populates="farmer")

class Farm(Base):
    __tablename__ = "farms"

    id = Column(String, primary_key=True, default=generate_uuid)
    farmer_id = Column(String, ForeignKey("users.id"))
    crop = Column(String, nullable=False)
    variety = Column(String)
    area_acres = Column(Float)
    location = Column(String)
    growth_stage = Column(String)

    farmer = relationship("User", back_populates="farms")
    scans = relationship("CropScan", back_populates="farm")
    sensors = relationship("SensorData", back_populates="farm")

class CropScan(Base):
    __tablename__ = "crop_scans"

    id = Column(String, primary_key=True, default=generate_uuid)
    farm_id = Column(String, ForeignKey("farms.id"))
    image_url = Column(Text)
    predicted_disease = Column(String)
    confidence = Column(Float)
    risk_score = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    farm = relationship("Farm", back_populates="scans")
    validations = relationship("ExpertValidation", back_populates="scan")
    followups = relationship("FollowUp", back_populates="scan")

class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(String, primary_key=True, default=generate_uuid)
    farm_id = Column(String, ForeignKey("farms.id"))
    temperature = Column(Float)
    humidity = Column(Float)
    soil_moisture = Column(Float)
    trap_count = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)

    farm = relationship("Farm", back_populates="sensors")

class ExpertValidation(Base):
    __tablename__ = "expert_validations"

    id = Column(String, primary_key=True, default=generate_uuid)
    scan_id = Column(String, ForeignKey("crop_scans.id"))
    expert_id = Column(String, ForeignKey("users.id"))
    diagnosis = Column(String)
    status = Column(String)  # pending, confirmed, rejected, lab_referred
    comments = Column(Text)

    scan = relationship("CropScan", back_populates="validations")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    risk_score = Column(Integer)
    message = Column(Text)
    location = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class FollowUp(Base):
    __tablename__ = "follow_ups"

    id = Column(String, primary_key=True, default=generate_uuid)
    scan_id = Column(String, ForeignKey("crop_scans.id"))
    followup_date = Column(DateTime, default=datetime.utcnow)
    image_url = Column(Text)
    status = Column(String)  # improving, no_change, worsening
    comments = Column(Text)

    scan = relationship("CropScan", back_populates="followups")

class PlantRecognitionRecord(Base):
    __tablename__ = "plant_recognitions"

    id = Column(String, primary_key=True, default=generate_uuid)
    common_name = Column(String, nullable=False)
    botanical_name = Column(String, nullable=False)
    family = Column(String)
    type = Column(String)
    confidence = Column(Float)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
