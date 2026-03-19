package com.moneymanager.service;

import com.moneymanager.entity.Category;
import com.moneymanager.entity.Transaction;
import com.moneymanager.entity.User;
import com.moneymanager.repository.TransactionRepository;
import com.moneymanager.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendWeeklySummaryToAll() {
        List<User> users = userRepository.findAll();
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(7);

        for (User user : users) {
            try {
                sendWeeklySummary(user, start, end);
            } catch (Exception e) {
                log.warn("Failed to send weekly email to {}: {}", user.getEmail(), e.getMessage());
            }
        }
    }

    public void sendWeeklySummary(User user, LocalDate start, LocalDate end) {
        try {
            BigDecimal income = transactionRepository.sumByUserAndTypeAndDateBetween(
                    user, Category.TransactionType.INCOME, start, end);
            BigDecimal expense = transactionRepository.sumByUserAndTypeAndDateBetween(
                    user, Category.TransactionType.EXPENSE, start, end);

            if (income == null) income = BigDecimal.ZERO;
            if (expense == null) expense = BigDecimal.ZERO;

            String subject = "💰 Your Weekly Money Manager Summary";
            String html = buildEmailHtml(user.getName(), income, expense, start, end);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Weekly summary sent to {}", user.getEmail());
        } catch (Exception e) {
            log.error("Error sending email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    private String buildEmailHtml(String name, BigDecimal income, BigDecimal expense, LocalDate from, LocalDate to) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        BigDecimal balance = income.subtract(expense);
        String balanceColor = balance.compareTo(BigDecimal.ZERO) >= 0 ? "#10b981" : "#ef4444";

        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 20px;">
              <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
                <h1 style="color: #6366f1; margin-bottom: 4px;">Money Manager</h1>
                <p style="color: #64748b;">Weekly Summary: %s – %s</p>
                <p>Hi <strong>%s</strong>, here's your financial summary for the past week:</p>
                <table style="width:100%%; border-collapse: collapse; margin-top: 16px;">
                  <tr>
                    <td style="padding: 12px; background: #f0fdf4; border-radius: 8px; text-align: center; width: 30%%;">
                      <div style="color: #10b981; font-size: 24px; font-weight: bold;">₹%.2f</div>
                      <div style="color: #64748b;">Total Income</div>
                    </td>
                    <td style="width: 5%%;"></td>
                    <td style="padding: 12px; background: #fef2f2; border-radius: 8px; text-align: center; width: 30%%;">
                      <div style="color: #ef4444; font-size: 24px; font-weight: bold;">₹%.2f</div>
                      <div style="color: #64748b;">Total Expense</div>
                    </td>
                    <td style="width: 5%%;"></td>
                    <td style="padding: 12px; background: #f8fafc; border-radius: 8px; text-align: center; width: 30%%;">
                      <div style="color: %s; font-size: 24px; font-weight: bold;">₹%.2f</div>
                      <div style="color: #64748b;">Net Balance</div>
                    </td>
                  </tr>
                </table>
                <p style="margin-top: 24px; color: #64748b; font-size: 14px;">Login to Money Manager to view your detailed transactions and manage your budget.</p>
              </div>
            </body>
            </html>
            """.formatted(from.format(fmt), to.format(fmt), name, income, expense, balanceColor, balance);
    }
}
