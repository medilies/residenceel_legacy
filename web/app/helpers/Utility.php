<?php

class Utility
{
    public static function create_report(string $type, $content): array
    {
        $types = ['ERROR', 'INTERNAL_ERROR', 'INVALID_DATA', 'MISSING_DATA', 'NOTICE', 'SUCCESSFUL_INSERTION', 'SUCCESSFUL_FETCH', 'SUCCESSFUL_DELETE', 'SUCCESSFUL_UPDATE'];

        if (!in_array($type, $types)) {
            $type = 'INTERNAL_ERROR';
            $content = 'Unexpected report type';
        }
        return [
            "REPORT" => $type,
            "CONTENT" => $content,
        ];
    }

    public static function create_error_report(string $type, $content): void
    {
        if (!in_array($type, ['ERROR', 'INTERNAL_ERROR'])) {
            echo json_encode(self::create_report('INTERNAL_ERROR', 'BAD METHOD USE'));
            die;
        }

        echo json_encode(self::create_report($type, $content));
        die;
    }

    public static function redirect(string $path): void
    {
        header("Location: " . $GLOBALS['SITE_NAME'] . $path);
    }
}
