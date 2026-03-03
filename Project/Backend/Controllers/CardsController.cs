using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardsController : ControllerBase
    {
        private readonly AppDbContext _db;

        // Inject database directly
        public CardsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _db.BusinessCards.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create(BusinessCard card)
        {
            // Check for duplicates BEFORE adding to the database
            var exists = await _db.BusinessCards.AnyAsync(c => c.Phone == card.Phone);
            if (exists)
            {
                // This sends a 400 error back to Angular
                return BadRequest("This phone number is already registered.");
            }

            _db.BusinessCards.Add(card);
            await _db.SaveChangesAsync();
            return Ok(card);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var card = await _db.BusinessCards.FindAsync(id);
            if (card != null)
            {
                _db.BusinessCards.Remove(card);
                await _db.SaveChangesAsync();
            }
            return Ok();
            
        }
    }
}