"""
🌱 KISANSETU Database Seeding Script
"""

from .database import SessionLocal, engine, Base
from .models import User, Farm, CropScan, SensorData, Alert

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).first():
            print("🌱 Database already contains seed data.")
            return

        print("🌱 Seeding database with demo records...")

        farmer = User(
            name="Rajesh Kumar",
            role="farmer",
            phone="+91 98765 43210",
            language="hi",
            location="Rampur Village"
        )
        db.add(farmer)
        db.commit()

        farm1 = Farm(
            farmer_id=farmer.id,
            crop="Rice",
            variety="Pusa Basmati 1121",
            area_acres=2.5,
            location="Rampur North Sector",
            growth_stage="Flowering"
        )
        farm2 = Farm(
            farmer_id=farmer.id,
            crop="Tomato",
            variety="Arka Rakshak",
            area_acres=1.8,
            location="Rampur South Sector",
            growth_stage="Fruiting"
        )
        db.add_all([farm1, farm2])
        db.commit()

        scan1 = CropScan(
            farm_id=farm1.id,
            predicted_disease="Rice Brown Spot",
            confidence=88.0,
            risk_score=72
        )
        scan2 = CropScan(
            farm_id=farm2.id,
            predicted_disease="Early Blight",
            confidence=91.0,
            risk_score=89
        )
        db.add_all([scan1, scan2])
        db.commit()

        sensor1 = SensorData(
            farm_id=farm1.id,
            temperature=29.4,
            humidity=84.0,
            soil_moisture=38.0,
            trap_count=18
        )
        db.add(sensor1)

        alert1 = Alert(
            user_id=farmer.id,
            risk_score=87,
            message="Rice pest activity is increasing in Rampur.",
            location="Rampur"
        )
        db.add(alert1)
        db.commit()

        print("✅ Database seeding complete!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
