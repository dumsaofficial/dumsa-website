<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$conn = ""; // Your database connection details here
require 'header.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['name']) || !isset($data['class'])) {
        echo json_encode(["status" => false, "message" => "Invalid input"]);
        exit();
    }

    $name = $data['name'];
    $class = $data['class'];

    // Prepare and bind the SQL statement
    $stmt = $conn->prepare("SELECT name FROM students WHERE level = ?");
    $stmt->bind_param("s", $class);

    // Execute the query
    $stmt->execute();
    $result = $stmt->get_result();

    $matches = [];
    while ($row = $result->fetch_assoc()) {
        $student_name = $row['name'];
        $search_words = explode(' ', $name);
        $student_words = explode(' ', $student_name);

        // Count the number of matching words
        $matches_count = 0;
        foreach ($search_words as $search_word) {
            foreach ($student_words as $student_word) {
                if (stripos($student_word, $search_word) !== false) {
                    $matches_count++;
                    break; // Break to the next search word
                }
            }
            // If at least two words match, add the student's name to matches
            if ($matches_count >= 2) {
                $matches[] = $student_name;
                break; // Break to the next student name
            }
        }
    }


    // Return the matches as a JSON response
    echo json_encode(["status" => true, "matches" => $matches]);

    // Close the connection
    $stmt->close();
    $conn->close();
}
?>
