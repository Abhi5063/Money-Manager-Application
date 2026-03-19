package com.moneymanager.scheduler;

import com.moneymanager.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class WeeklySummaryScheduler {

    private final EmailService emailService;

    // Every Monday at 8:00 AM
    @Scheduled(cron = "0 0 8 * * MON")
    public void sendWeeklySummaries() {
        log.info("Running weekly summary email task...");
        emailService.sendWeeklySummaryToAll();
        log.info("Weekly summary email task completed.");
    }
}
