using Backend.Controllers;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Xunit;

namespace Backend.Tests
{
    public class CardsControllerTests
    {
        // A simple helper to give us a fake, empty database for testing
        private AppDbContext GetFakeDatabase()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task Test_SaveNewCard_Works()
        {
            // 1. Setup: Create the fake database and controller
            var db = GetFakeDatabase();
            var controller = new CardsController(db);
            var newCard = new BusinessCard { Name = "Ali", Phone = "0791234567" };

            // 2. Action: Try to save the card
            var result = await controller.Create(newCard);

            // 3. Check: Did it succeed? (OkObjectResult means success)
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Test_SaveDuplicatePhone_Fails()
        {
            // 1. Setup: Add a user to the database first
            var db = GetFakeDatabase();
            db.BusinessCards.Add(new BusinessCard { Name = "First User", Phone = "0790000000" });
            await db.SaveChangesAsync();

            var controller = new CardsController(db);

            // Create a second user with the EXACT SAME phone number
            var duplicateCard = new BusinessCard { Name = "Second User", Phone = "0790000000" };

            // 2. Action: Try to save the duplicate card
            var result = await controller.Create(duplicateCard);

            // 3. Check: Did the system block it? (BadRequest means blocked)
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Test_GetAllCards_Works()
        {
            // 1. Setup: Add two users to the database
            var db = GetFakeDatabase();
            db.BusinessCards.Add(new BusinessCard { Name = "User 1", Phone = "111" });
            db.BusinessCards.Add(new BusinessCard { Name = "User 2", Phone = "222" });
            await db.SaveChangesAsync();

            var controller = new CardsController(db);

            // 2. Action: Ask the controller for all cards (like the Export feature does)
            var result = await controller.GetAll();

            // 3. Check: Did it successfully return the data?
            Assert.IsType<OkObjectResult>(result);
        }
    }
}