using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Auctioneer.Server.Models;

namespace Auctioneer.Server.Data

{
    public class AppDbContext : DbContext
    {
        protected readonly IConfiguration configuration;

        public AppDbContext(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseNpgsql(configuration.GetConnectionString("DataBaseConnection"));
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Artwork> Artworks { get; set; }
        public DbSet<Sale> Sales { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(x => x.Artworks)
                .WithMany(y => y.Users)
                .UsingEntity(j => j.ToTable("ArtworkUser"));
            base.OnModelCreating(modelBuilder);
        }
    }
}