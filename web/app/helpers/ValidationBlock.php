<?php
class ValidationBlock
{
    public static function apt_type(string $apt_type): bool
    {
        if (
            preg_match("/^F[2-5]$/", $apt_type)
        ) {
            return true;
        } else {
            return false;
        }
    }

    public static function apt_to_bloc(string $apt_label, string $bloc_id): bool
    {
        if (
            preg_match("/^$bloc_id-[1-7]$/", $apt_label)
        ) {
            return true;
        } else {
            return false;
        }
    }

    public static function apt(string $apt_label): bool
    {
        if (
            preg_match('/^[A-Z][1-9]?-[1-7]$/', $apt_label)
        ) {
            return true;
        } else {
            return false;
        }
    }

    public static function surface(float $surface, float $surface_real): bool
    {
        if (
            $surface >= $surface_real &&
            $surface < 200 &&
            $surface_real > 50 &&
            $surface_real < 200) {
            return true;
        } else {
            return false;
        }
    }

    public static function bloc(string $bloc_id): bool
    {
        if (
            preg_match("/^[A-Z][1-9]?$/", $bloc_id)
        ) {
            return true;
        } else {
            return false;
        }
    }

    public static function floors_nb(int $floors_nb): bool
    {
        if ($floors_nb >= 5 && $floors_nb <= 20) {
            return true;
        } else {
            return false;
        }
    }

    public static function floors_serie(string $floors_serie): bool
    {
        if (preg_match("/^(1?[0-9];)*1?[0-9];?$/", $floors_serie)) {
            return true;
        } else {
            return false;
        }
    }
}
