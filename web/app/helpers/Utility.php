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
}
