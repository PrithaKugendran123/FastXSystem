using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FastX.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FastX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly FastXContext _context;

        public BookingsController(FastXContext context)
        {
            _context = context;
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookings()
        {
            if (_context.Bookings == null)
            {
                return NotFound();
            }

            var bookings = await _context.Bookings
                .Include(b => b.Bus)
                .Include(b => b.User)
                .ToListAsync();

            var bookingDtos = bookings.Select(b => new BookingDto
            {
                BookingId = b.BookingId,
                UserName = b.User != null ? b.User.Name : "Unknown",
                Email = b.User != null ? b.User.Email : "Unknown",
                BusName = b.Bus != null ? b.Bus.BusName : "Unknown",
                BusNumber = b.Bus != null ? b.Bus.BusNumber : "Unknown",
                SeatNumbers = b.SeatNumbers,
                TotalCost = b.TotalCost,
                BookingDate = b.BookingDate,
                PickUp = b.Bus != null ? b.Bus.PickUp : "Unknown",
                DropPoint = b.Bus != null ? b.Bus.DropPoint : "Unknown"
            }).ToList();
            return Ok(bookingDtos);
        }

        // GET: api/Bookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDto>> GetBooking(int id)
        {
            if (_context.Bookings == null)
            {
                return NotFound();
            }

            var booking = await _context.Bookings
                .Include(b => b.Bus)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.BookingId == id);

            if (booking == null)
            {
                return NotFound();
            }

            var bookingDto = new BookingDto
            {
                BookingId = booking.BookingId,
                UserName = booking.User != null ? booking.User.Name : "Unknown",
                Email = booking.User != null ? booking.User.Email : "Unknown",
                BusName = booking.Bus != null ? booking.Bus.BusName : "Unknown",
                BusNumber = booking.Bus != null ? booking.Bus.BusNumber : "Unknown",
                SeatNumbers = booking.SeatNumbers,
                TotalCost = booking.TotalCost,
                BookingDate = booking.BookingDate
            };

            return Ok(bookingDto);
        }

        // GET: api/Bookings/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookingsByUserId(int userId)
        {
            if (_context.Bookings == null)
            {
                return NotFound();
            }

            var bookings = await _context.Bookings
                .Where(b => b.UserId == userId)
                .Include(b => b.Bus)
                .Include(b => b.User)
                .ToListAsync();

            if (bookings == null || !bookings.Any())
            {
                return NotFound();
            }

            var bookingDtos = bookings.Select(b => new BookingDto
            {
                BookingId = b.BookingId,
                UserName = b.User != null ? b.User.Name : "Unknown",
                Email = b.User != null ? b.User.Email : "Unknown",
                BusName = b.Bus != null ? b.Bus.BusName : "Unknown",
                BusNumber = b.Bus != null ? b.Bus.BusNumber : "Unknown",
                SeatNumbers = b.SeatNumbers,
                TotalCost = b.TotalCost,
                BookingDate = b.BookingDate,
                PickUp = b.Bus != null ? b.Bus.PickUp : "Unknown",
                DropPoint = b.Bus != null ? b.Bus.DropPoint : "Unknown"
            }).ToList();

            return Ok(bookingDtos);
        }

        // PUT: api/Bookings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooking(int id, Booking booking)
        {
            if (id != booking.BookingId)
            {
                return BadRequest();
            }

            _context.Entry(booking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Bookings
        [HttpPost]
        public async Task<ActionResult<Booking>> PostBooking(Booking booking)
        {
            if (_context.Bookings == null)
            {
                return Problem("Entity set 'FastXContext.Bookings' is null.");
            }
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBooking", new { id = booking.BookingId }, booking);
        }

        // DELETE: api/Bookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            if (_context.Bookings == null)
            {
                return NotFound();
            }
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookingExists(int id)
        {
            return (_context.Bookings?.Any(e => e.BookingId == id)).GetValueOrDefault();
        }
    }

    // DTO for returning booking details with related data
    public class BookingDto
    {
        public int BookingId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string BusName { get; set; }
        public string BusNumber { get; set; }
        public string SeatNumbers { get; set; }
        public decimal TotalCost { get; set; }
        public DateTime BookingDate { get; set; }
        public string PickUp { get; set; }
        public string DropPoint { get; set; }
    }
}
