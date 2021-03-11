<?php ob_start();?>
<aside>
    <div class="aside-body pt1">
        <div class="pl1">
            <p class="u header4">Naviguer:</p>
            <a class="header5 aside-href ml1" href="#srch-apt" aside-href>Chercher un apartment</a>
            <a class="header5 aside-href ml1"href="#srch-apt-taken" aside-href>Apartments resérvés/vendus</a>
            <a class="header5 aside-href ml1" href="#srch-apt-free" aside-href>Apartements libres</a>
            <a class="header5 aside-href ml1" href="#srch-clients" aside-href>Clients</a>
        </div>
        <div class="pl1">
            <p class="u header4">Insérer:</p>
            <a class="header5 aside-href ml1" href="#ins-bloc" aside-href>Inserer un bloc</a>
            <a class="header5 aside-href ml1" href="#ins-apt" aside-href>Inserer des apartments</a>
            <a class="header5 aside-href ml1" href="#client" aside-href>Inserer un client</a>
        </div>
    </div>
</aside>

<main class="p1">
    <div id="forms-container"></div>
    <div id="reports-container"></div>
</main>

<?php $content = ob_get_clean();?>
<?php require_once PROJECT_ROOT . '/app/views/inc/layout.php';?>
