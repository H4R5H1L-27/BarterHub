package com.barterhub.jdbc.models;

public class ListingSummary {
    private String id;
    private String title;
    private String listingType;
    private String exchangeType;
    private Double price;
    private String condition;
    private String status;
    private String ownerName;
    private String city;

    public ListingSummary(String id, String title, String listingType, String exchangeType, Double price, String condition, String status, String ownerName, String city) {
        this.id = id;
        this.title = title;
        this.listingType = listingType;
        this.exchangeType = exchangeType;
        this.price = price;
        this.condition = condition;
        this.status = status;
        this.ownerName = ownerName;
        this.city = city;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getListingType() { return listingType; }
    public String getExchangeType() { return exchangeType; }
    public Double getPrice() { return price; }
    public String getCondition() { return condition; }
    public String getStatus() { return status; }
    public String getOwnerName() { return ownerName; }
    public String getCity() { return city; }

    @Override
    public String toString() {
        return String.format("[%-10s] %-40s | %-12s | %-8s | %-16s | %s",
            listingType,
            (title.length() > 40 ? title.substring(0, 37) + "..." : title),
            exchangeType,
            (price != null ? String.format("$%.2f", price) : "Barter"),
            ownerName,
            city);
    }
}
