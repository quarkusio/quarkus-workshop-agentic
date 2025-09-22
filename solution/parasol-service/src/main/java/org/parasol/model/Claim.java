package org.parasol.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import io.quarkus.hibernate.orm.panache.PanacheEntity;

import java.time.LocalDate;

import com.fasterxml.jackson.databind.PropertyNamingStrategies.SnakeCaseStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@Entity
@JsonNaming(SnakeCaseStrategy.class)
public class Claim extends PanacheEntity {
    public String claimNumber;
    public String category;
    public String policyNumber;
    @Column(columnDefinition="DATETIME")
    @Temporal(TemporalType.DATE)
    public LocalDate inceptionDate;
    public String clientName;
    public String subject;
    @Column(length = 5000)
    public String body;
    @Column(length = 5000)
    public String summary;
    @Column(columnDefinition = "TEXT")
    public String location;
    @Column(name = "claim_time")
    public String time;
    @Column(length = 5000)
    public String sentiment;
    public String emailAddress;
    public String status;
    @Column(columnDefinition = "TEXT")
    public String originalImages; // JSON array of original image objects
    @Column(columnDefinition = "TEXT")
    public String processedImages; // JSON array of processed image objects
}
