<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form fields and remove whitespace.
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Invalid data
        http_response_code(400);
        echo "Please complete the form and try again.";
        exit;
    }

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // Mailtrap SMTP configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.mailtrap.io';  // Replace with your Mailtrap host
        $mail->SMTPAuth = true;
        $mail->Username = 'c1ca257c493c01';  // Replace with Mailtrap SMTP username
        $mail->Password = 'e7954537aa3f46';  // Replace with Mailtrap SMTP password
        $mail->Port = 2525;  // Port used by Mailtrap

        // Sender and recipient details
        $mail->setFrom($email, $name);
        $mail->addAddress('your-email@example.com', 'Your Name');  // Replace with your email

        // Email subject and body
        $mail->Subject = "New Contact from $name";
        $mail->Body = "Name: $name\nEmail: $email\nMessage: $message";

        // Send the email
        $mail->send();
        http_response_code(200);
        echo "Message sent successfully!";
    } catch (Exception $e) {
        http_response_code(500);
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    // Invalid request
    http_response_code(403);
    echo "There was a problem with your submission. Please try again.";
}
