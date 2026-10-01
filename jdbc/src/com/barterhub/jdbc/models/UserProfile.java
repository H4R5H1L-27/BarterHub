package com.barterhub.jdbc.models;

public class UserProfile {
    private String id;
    private String name;
    private String email;
    private String city;
    private String state;
    private double reputationScore;
    private int totalTrades;
    private int activeListingsCount;

    public UserProfile(String id, String name, String email, String city, String state, double reputationScore, int totalTrades, int activeListingsCount) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.city = city;
        this.state = state;
        this.reputationScore = reputationScore;
        this.totalTrades = totalTrades;
        this.activeListingsCount = activeListingsCount;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public double getReputationScore() { return reputationScore; }
    public int getTotalTrades() { return totalTrades; }
    public int getActiveListingsCount() { return activeListingsCount; }

    @Override
    public String toString() {
        return String.format("Trader: %s (%s) | Location: %s, %s | Rating: %.2f/5.0 | Trades: %d | Active Listings: %d",
            name, email, city, state, reputationScore, totalTrades, activeListingsCount);
    }
}
