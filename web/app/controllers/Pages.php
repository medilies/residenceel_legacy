<?php
/**
 * Kinda loads HTML pages ith its related assets
 * Directly related with layout page
 */
class Pages extends Controller
{

    public function index()
    {
        $data = [
            'title' => 'Home',
            'stylesheets_array' => [],
            'scripts_array' => ["manager"],
        ];
        $this->view('pages/home', $data);
    }

    public function login()
    {
        $data = [
            'title' => 'Home',
            'stylesheets_array' => ["login"],
            'scripts_array' => ["login"],
        ];
        $this->view('pages/login', $data);
    }

}
