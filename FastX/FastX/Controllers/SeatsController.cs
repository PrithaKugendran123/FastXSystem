using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FastX.Models;
using Microsoft.Extensions.Logging;

namespace FastX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatsController : ControllerBase
    {
        private readonly FastXContext _context;
        private readonly ILogger<SeatsController> _logger;

        public SeatsController(FastXContext context, ILogger<SeatsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetSeats([FromQuery] int? busId = null)
        {
            if (busId.HasValue)
            {
                var seats = await _context.Seats
                    .Include(seat => seat.Bus)
                    .Where(seat => seat.Bus.BusId == busId.Value)
                    .ToListAsync();

                if (seats == null || !seats.Any())
                {
                    return NotFound();
                }

                var result = seats.Select(seat => new
                {
                    SeatId = seat.SeatId,
                    SeatNumber = seat.SeatNumber,
                    IsAvailable = seat.IsAvailable,
                    Bus = new
                    {
                        BusId = seat.Bus.BusId,
                        BusNumber = seat.Bus.BusNumber,
                        BusName = seat.Bus.BusName,
                    }
                });

                return Ok(result);
            }
            else
            {
                var seats = await _context.Seats
                    .Include(seat => seat.Bus)
                    .ToListAsync();

                if (seats == null || !seats.Any())
                {
                    return NotFound();
                }

                var result = seats.Select(seat => new
                {
                    SeatId = seat.SeatId,
                    SeatNumber = seat.SeatNumber,
                    IsAvailable = seat.IsAvailable,
                    Bus = new
                    {
                        BusId = seat.Bus.BusId,
                        BusNumber = seat.Bus.BusNumber,
                        BusName = seat.Bus.BusName,
                    }
                });

                return Ok(result);
            }
        }

        // GET: api/Seats/ByBus/10
        [HttpGet("ByBus/{busId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetSeatsByBus(int busId)
        {
            var seats = await _context.Seats
                .Include(seat => seat.Bus)
                .Where(seat => seat.Bus.BusId == busId)
                .ToListAsync();

            if (seats == null || !seats.Any())
            {
                return NotFound();
            }

            var result = seats.Select(seat => new
            {
                SeatId = seat.SeatId,
                SeatNumber = seat.SeatNumber,
                IsAvailable = seat.IsAvailable,
                Bus = new
                {
                    BusId = seat.Bus.BusId,
                    BusNumber = seat.Bus.BusNumber,
                    BusName = seat.Bus.BusName,
                }
            });

            return Ok(result);
        }


        // GET: api/Seats/5
        [HttpGet("{seatId}")]
        public async Task<ActionResult<object>> GetSeat(int seatId)
        {
            var seat = await _context.Seats
                .Where(s => s.SeatId == seatId)
                .Select(s => new
                {
                    SeatId = s.SeatId,
                    SeatNumber = s.SeatNumber,
                    IsAvailable = s.IsAvailable, 
                    Bus = new
                    {
                        BusId = s.Bus.BusId,
                        BusNumber = s.Bus.BusNumber,
                        BusName = s.Bus.BusName
                    }
                })
                .FirstOrDefaultAsync();

            if (seat == null)
            {
                return NotFound();
            }

            return seat;
        }

        // PUT: api/Seats/Select/5
        [HttpPut("Select/{seatId}")]
        public async Task<IActionResult> UpdateSeatSelection(int seatId, [FromBody] bool isAvailable)
        {
            _logger.LogInformation($"Updating seat status for seatId: {seatId} to isAvailable: {isAvailable}");

            var seat = await _context.Seats.FindAsync(seatId);
            if (seat == null)
            {
                _logger.LogWarning($"Seat with ID {seatId} not found.");
                return NotFound();
            }

            seat.IsAvailable = isAvailable;
            _context.Entry(seat).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeatExists(seatId))
                {
                    _logger.LogWarning($"Concurrency issue: Seat with ID {seatId} does not exist.");
                    return NotFound();
                }
                else
                {
                    _logger.LogError($"Concurrency error while updating seat with ID {seatId}.");
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Seats
        [HttpPost]
        public async Task<ActionResult<Seat>> PostSeat(Seat seat)
        {
            if (_context.Seats == null)
            {
                return Problem("Entity set 'FastXContext.Seats' is null.");
            }

            _context.Seats.Add(seat);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSeat), new { seatId = seat.SeatId }, seat);
        }

        // GET: api/Seats/Details/5
        [HttpGet("Details/{seatId}")]
        public async Task<ActionResult<object>> GetSeatDetails(int seatId)
        {
            var seat = await _context.Seats
                .Where(s => s.SeatId == seatId)
                .Select(s => new
                {
                    SeatId = s.SeatId,
                    SeatNumber = s.SeatNumber,
                    IsAvailable = s.IsAvailable
                })
                .FirstOrDefaultAsync();

            if (seat == null)
            {
                return NotFound();
            }

            return seat;
        }

        // DELETE: api/Seats/5
        [HttpDelete("{seatId}")]
        public async Task<IActionResult> DeleteSeat(int seatId)
        {
            if (_context.Seats == null)
            {
                return NotFound();
            }

            var seat = await _context.Seats.FindAsync(seatId);
            if (seat == null)
            {
                return NotFound();
            }

            _context.Seats.Remove(seat);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SeatExists(int seatId)
        {
            return (_context.Seats?.Any(e => e.SeatId == seatId)).GetValueOrDefault();
        }
    }
}
