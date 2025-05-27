package com.email_writer.application;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
}
