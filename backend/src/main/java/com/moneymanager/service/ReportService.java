package com.moneymanager.service;

import com.moneymanager.entity.Category;
import com.moneymanager.entity.Transaction;
import com.moneymanager.entity.User;
import com.moneymanager.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TransactionRepository transactionRepository;

    public String generateCsv(User user, LocalDate from, LocalDate to) {
        List<Transaction> transactions;
        if (from != null && to != null) {
            transactions = transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, from, to);
        } else {
            transactions = transactionRepository.findByUserOrderByDateDesc(user);
        }

        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        pw.println("ID,Date,Type,Category,Description,Amount");
        for (Transaction t : transactions) {
            pw.printf("%d,%s,%s,%s,\"%s\",%.2f%n",
                    t.getId(),
                    t.getDate(),
                    t.getType().name(),
                    t.getCategory().getName(),
                    t.getDescription() != null ? t.getDescription().replace("\"", "\"\"") : "",
                    t.getAmount()
            );
        }
        return sw.toString();
    }
}
