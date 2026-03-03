# Full-Stack Business Card Manager

A complete, full-stack web application designed to manage, store, and export professional contacts. Built with a modern Angular frontend and a robust C# .NET 8 backend API, connected to a SQL Server database.

## 🚀 Features
* **Complete CRUD Operations:** Create, Read, and Delete business card records.
* **Smart Validation:** Backend logic prevents duplicate phone numbers from being saved, providing immediate, inline UI feedback.
* **CSV Data Export:** Instantly download all stored records into a formatted Excel-ready `.csv` file.
* **Image Processing:** Supports profile photo uploads by converting image files to Base64 strings for database storage.
* **Responsive UI:** Built with Bootstrap 5, featuring toggleable data tables, clean forms, and immediate visual feedback.
* **Unit Tested:** Includes xUnit testing for the .NET API to verify data import/export pipelines and validation logic.

## 🛠️ Technology Stack
* **Frontend:** Angular, TypeScript, HTML/CSS, Bootstrap 5
* **Backend:** C# .NET 8, ASP.NET Core Web API
* **Database:** Microsoft SQL Server, Entity Framework Core (EF Core)
* **Testing:** xUnit, In-Memory Database

## ⚙️ How to Run the Project Locally

### 1. Database Setup
1. Open SQL Server Management Studio (SSMS).
2. Create a new database named `BusinessCardDB`.
3. Open the provided `DatabaseSetup.sql` file and execute it to generate the `BusinessCards` table.
4. Update the `DefaultConnection` string in `Backend/appsettings.json` with your local SQL Server credentials.

### 2. Backend Setup (.NET API)
1. Open a terminal inside the `Backend` folder.
2. Restore packages and run the application:
   ```bash
   dotnet restore
   dotnet run
