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
            'stylesheets_array' => [],
            'scripts_array' => ["login"],
        ];
        $this->view('pages/login', $data);
    }

    /**
     * Return Anchor element to be echoed in nav bar
     */
    protected function nav_element(string $id, string $class_list, string $href, string $textnode, string $fontawesome)
    {

        $element = "<a id='$id' class='$class_list' href='/$href'>";

        $element .= ">";

        if ($fontawesome !== "") {
            $element .= "<i class='$fontawesome'></i> ";
        }
        $element .= "$textnode</a>";

        return $element;
    }

}
