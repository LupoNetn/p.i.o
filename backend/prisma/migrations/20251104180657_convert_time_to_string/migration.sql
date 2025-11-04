-- Convert TIMESTAMP columns to TEXT, converting existing values to HH:MM format
ALTER TABLE "Booking" 
  ALTER COLUMN "startTime" TYPE TEXT USING TO_CHAR("startTime"::timestamp, 'HH24:MI'),
  ALTER COLUMN "endTime" TYPE TEXT USING TO_CHAR("endTime"::timestamp, 'HH24:MI');
