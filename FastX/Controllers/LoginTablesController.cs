﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FastX.Models;

namespace FastX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginTablesController : ControllerBase
    {
        private readonly FastXContext _context;

        public LoginTablesController(FastXContext context)
        {
            _context = context;
        }

        // GET: api/LoginTables
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoginTable>>> GetLoginTables()
        {
          if (_context.LoginTables == null)
          {
              return NotFound();
          }
            return await _context.LoginTables.ToListAsync();
        }

        // GET: api/LoginTables/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LoginTable>> GetLoginTable(int id)
        {
          if (_context.LoginTables == null)
          {
              return NotFound();
          }
            var loginTable = await _context.LoginTables.FindAsync(id);

            if (loginTable == null)
            {
                return NotFound();
            }

            return loginTable;
        }

        // PUT: api/LoginTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoginTable(int id, LoginTable loginTable)
        {
            if (id != loginTable.LoginId)
            {
                return BadRequest();
            }

            _context.Entry(loginTable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoginTableExists(id))
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

        // POST: api/LoginTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LoginTable>> PostLoginTable(LoginTable loginTable)
        {
          if (_context.LoginTables == null)
          {
              return Problem("Entity set 'FastXContext.LoginTables'  is null.");
          }
            _context.LoginTables.Add(loginTable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLoginTable", new { id = loginTable.LoginId }, loginTable);
        }

        // DELETE: api/LoginTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoginTable(int id)
        {
            if (_context.LoginTables == null)
            {
                return NotFound();
            }
            var loginTable = await _context.LoginTables.FindAsync(id);
            if (loginTable == null)
            {
                return NotFound();
            }

            _context.LoginTables.Remove(loginTable);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LoginTableExists(int id)
        {
            return (_context.LoginTables?.Any(e => e.LoginId == id)).GetValueOrDefault();
        }
    }
}
