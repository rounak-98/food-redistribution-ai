from sqlalchemy import text
from app.database.database import engine

def migrate_donations_schema():
    with engine.connect() as conn:
        dialect = engine.dialect.name
        print(f"[MIGRATION] Checking donations schema for dialect: {dialect}...")

        if dialect == "mysql":
            try:
                conn.execute(text("ALTER TABLE donations MODIFY business_id INT NULL;"))
                conn.commit()
            except Exception as e:
                print(f"[MIGRATION] Note on business_id nullability: {e}")

            try:
                cols = [r[0] for r in conn.execute(text("DESCRIBE donations;")).fetchall()]
                if "donor_type" not in cols:
                    conn.execute(text("ALTER TABLE donations ADD COLUMN donor_type VARCHAR(20) DEFAULT 'business';"))
                    conn.commit()
                    print("[MIGRATION] Added donor_type column to donations table.")
                if "individual_id" not in cols:
                    conn.execute(text("ALTER TABLE donations ADD COLUMN individual_id INT NULL;"))
                    conn.commit()
                    print("[MIGRATION] Added individual_id column to donations table.")
            except Exception as e:
                print(f"[MIGRATION] Error altering columns: {e}")

            try:
                res = conn.execute(text(
                    "UPDATE donations SET donor_type = 'individual', business_id = NULL "
                    "WHERE food_category = 'Home Cooked Meal' OR food_name LIKE '%Paneer Butter%' "
                    "OR contact_person = 'Amit Verma';"
                ))
                conn.commit()
                print(f"[MIGRATION] Disassociated {res.rowcount} individual donation(s) from businesses.")
            except Exception as e:
                print(f"[MIGRATION] Error migrating individual donation records: {e}")

        elif dialect == "sqlite":
            try:
                table_info = conn.execute(text("PRAGMA table_info(donations);")).fetchall()
                col_names = [col[1] for col in table_info]
                if "donor_type" not in col_names:
                    conn.execute(text("ALTER TABLE donations ADD COLUMN donor_type VARCHAR(20) DEFAULT 'business';"))
                    conn.commit()
                    print("[MIGRATION SQLite] Added donor_type column to donations.")
                if "individual_id" not in col_names:
                    conn.execute(text("ALTER TABLE donations ADD COLUMN individual_id INTEGER;"))
                    conn.commit()
                    print("[MIGRATION SQLite] Added individual_id column to donations.")
            except Exception as e:
                print(f"[MIGRATION SQLite] Column check error: {e}")

            try:
                res = conn.execute(text(
                    "UPDATE donations SET donor_type = 'individual', business_id = NULL "
                    "WHERE food_category = 'Home Cooked Meal' OR food_name LIKE '%Paneer Butter%' "
                    "OR contact_person = 'Amit Verma';"
                ))
                conn.commit()
                print(f"[MIGRATION SQLite] Disassociated {res.rowcount} individual donation(s) from businesses.")
            except Exception as e:
                print(f"[MIGRATION SQLite] Error updating records: {e}")

if __name__ == "__main__":
    migrate_donations_schema()
