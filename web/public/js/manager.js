class UI {
    /**
     *
     * @param {HTMLDivElement} formsContainer
     * @param {HTMLDivElement} reportsContainer
     */
    constructor(formsContainer, reportsContainer) {
        this.formsContainer = formsContainer;
        this.reportsContainer = reportsContainer;

        this.insBloc_AptInputNameIterator = 0;
        this.insApts_FloorsInputNameIterator = 0;
    }

    reset() {
        this.formsContainer.innerHTML = "";
        this.insBloc_AptInputNameIterator = 0;
        this.insApts_FloorsInputNameIterator = 0;
    }

    /**
     * - Creates a form this targetable with an ID
     * - The form has 3 buttons
     * - - ADD apartement, targetable with an attr
     * - - RM last apartement, targetable with an attr
     * - - Submit form button
     *
     * FORM validation on client side depends on HTML FORM INPUT attributes (MIN, MAX, LIST, PATTERN)
     *
     * @param {Number} insBloc_AptInputNameIterator is a very vital virable for this form:
     * - It insures that apt_label & apt_type are in synch
     * - It insures max apts/floor
     * - Sets added apt default value
     *
     */
    insBloc() {
        const insBloc_div = document.createElement("div");

        this.insBloc_blocIdInput_id = "insBloc-bloc";
        this.insBloc_submitBtn_id = "insBloc-submit-btn";
        this.insBloc_aptContainerDiv_id = "insBloc-apt-container";

        insBloc_div.innerHTML = `
            <form onsubmit="insBloc_form_submit(event)">

                <label for="bloc_id"><i class="fas fa-building"></i> Nom du bloc</label>
                <input name="bloc_id" id="${this.insBloc_blocIdInput_id}" type="text" placeholder="A1..." required pattern="[a-zA-Z][0-9]?" class="w5 first-input"/>
                
                <label for="floors_nb"><i class="fas fa-layer-group"></i> Nombre des étages</label>
                <input name="floors_nb" type="number" min="5" max="20" placeholder="5..." required class="w3"/>
                
                <button type="button" onclick="ui.insBloc_addApt()" class="btn add-btn inline wp1"><i class="fas fa-plus-square"></i> Apartement</button>

                <button type="button" onclick="ui.insBloc_rmApt()" class="btn rm-btn wp1 inline"><i class="fas fa-minus-square"></i> Apartement</button>

                <div id="${this.insBloc_aptContainerDiv_id}" class="bg-l-grey p05 mb1 br1"></div>

                <datalist id="chambres">
                  <option value="F2">
                  <option value="F3">
                  <option value="F4">
                  <option value="F5">
                </datalist>
                
                <button name="insBloc" type="submit" id="${this.insBloc_submitBtn_id}" class="btn add-btn wp1"><i class="fas fa-check-square"></i> Enregistrer</button>
                
            </form>
        `;

        this.formsContainer.appendChild(insBloc_div);
    }

    insBloc_addApt() {
        // MAX 8 apts/floor
        if (this.insBloc_AptInputNameIterator >= 7) return;

        const blocIdInput = document.getElementById(
            this.insBloc_blocIdInput_id
        );
        const aptLabelBlocPrefix = blocIdInput.value;
        // Bloc tag must be set
        if (aptLabelBlocPrefix === "") {
            return;
        }
        // block tag is set. then lock its input
        else {
            blocIdInput.setAttribute("readonly", "");
            blocIdInput.classList.add("locked-input");
        }

        const i = this.insBloc_AptInputNameIterator;
        // Default value start from 1 unlike names that start from 0
        this.insBloc_AptInputNameIterator++;
        const aptLabelDefaultValue = `${aptLabelBlocPrefix}-${this.insBloc_AptInputNameIterator}`;

        const apt = document.createElement("div");
        apt.classList.add("flex-row-base", "bg-w", "br05", "mt05", "mb05");
        apt.innerHTML = `
            <div class="ml1">
                <label for="apts[${i}][apt_label]">Apartement</label>
                <input name="apts[${i}][apt_label]" value="${aptLabelDefaultValue}" type="text" required readonly pattern="[a-zA-Z][0-9]?-[1-8]" class="w5 locked-input"/>
            </div>
            
            <div class="ml1">
                <label for="apts[${i}][apt_type]">Type</label>
                <input name="apts[${i}][apt_type]" type="text" placeholder="F2,F3..." required pattern="F[2-5]" list="chambres" class="w4"/>
            </div>
        `;

        const aptContainer = document.getElementById(
            this.insBloc_aptContainerDiv_id
        );
        aptContainer.appendChild(apt);
    }

    insBloc_rmApt() {
        if (this.insBloc_AptInputNameIterator > 0) {
            document
                .querySelector(
                    "#" + this.insBloc_aptContainerDiv_id + ">div:last-child"
                )
                .remove();
            this.insBloc_AptInputNameIterator--;
        }
    }

    insApts(blocsData) {
        // console.table(blocsData);

        this.insApts_selectBloc_id = "insApts-select-bloc";
        this.insApts_submitBtn_id = "insApts_submit-btn";
        this.insApts_floorsContainerDiv_id = "insApts-floors-container";

        // Create form with container for adding floors & apts
        const insApt_div = document.createElement("div");
        insApt_div.innerHTML = `
        <form onsubmit="insApts_form_submit(event)">
            <label for"bloc_id"><i class="fas fa-building"></i> Bloc</label>
            <select name="bloc_id" required class="w5 first-input" id="${
                this.insApts_selectBloc_id
            }">
            ${blocsData.map((bloc) => {
                if (bloc.has_houses === "0")
                    return `<option value="${bloc.bloc_id}">${bloc.bloc_id}</option>`;
            })}
            </select>

            <button type="button" class="inline wp1 btn add-btn" onclick="ui.insApts_addFloor()"><i class="fas fa-plus-square"></i> Série d'étages</button>

            <button type="button" class="inline wp1 btn rm-btn" onclick="ui.insApts_rmFloor()"><i class="fas fa-minus-square"></i> Série d'étages</button>

            <div id="${
                this.insApts_floorsContainerDiv_id
            }" class="bg-l-grey br1 p05 mb1"></div>
            
            <button id="${
                this.insApts_submitBtn_id
            }" type="submit" class="inline wp1 btn add-btn"><i class="fas fa-check-square"></i> Enregistrer</button>
        </form>
        `;

        this.formsContainer.appendChild(insApt_div);
    }

    insApts_addFloor() {
        if (this.insApts_FloorsInputNameIterator >= 5) return;

        const floorsContainer = document.getElementById(
            this.insApts_floorsContainerDiv_id
        );

        // will iterate inside insApts_floorApts()
        const i = this.insApts_FloorsInputNameIterator;

        const floors = document.createElement("div");
        floors.classList.add("card", "mt1", "mb1");
        floors.innerHTML = `
        <label for="floors"><i class="fas fa-layer-group"></i> Serie d'étages</label>
        <input name="floors[${i}][floors]" placeholder="3;5;6;9;..." pattern="([0-9]+;)*[0-9]+(;)?" required class="inline"/>
        
        ${this.insApts_floorApts(state.blocsData)}
        `;

        floorsContainer.appendChild(floors);
    }

    insApts_rmFloor() {
        if (this.insApts_FloorsInputNameIterator > 0) {
            document
                .querySelector(
                    "#" + this.insApts_floorsContainerDiv_id + ">div:last-child"
                )
                .remove();
            this.insApts_FloorsInputNameIterator--;
        }
    }

    insApts_floorApts(blocsData) {
        let aptsDivs = "";
        // console.table(blocsData);

        const blocSelect = document.getElementById(this.insApts_selectBloc_id);
        blocSelect.style.pointerEvents = "none";
        blocSelect.classList.add("locked-input");
        const bloc_id = blocSelect.value;

        const i = this.insApts_FloorsInputNameIterator;

        blocsData.forEach((bloc) => {
            if (bloc.bloc_id === bloc_id) {
                bloc.apts.forEach((apt, j) => {
                    aptsDivs += `
                    <div class="flex-row-base">
                        <div class="ml1">
                            <label for"apt">Apartement</label>
                            <input name="floors[${i}][houses][${j}][apt_label]" type="text" required readonly value="${apt[0]}" class="w3 locked-input">
                        </div>
                        <div class="ml1">
                            <label>Type</label>
                            <input readonly value="${apt[1]}" class="w3 locked-input">
                        </div>
                        <div class="ml1">
                            <label for"surf">Surface</label>
                            <input name="floors[${i}][houses][${j}][surface]" type="number" required min="50.00" max="200.00" step="0.01" class="w5">
                        </div>
                        <div class="ml1">
                            <label for"surfR">Surface utile</label>
                            <input name="floors[${i}][houses][${j}][surface_real]" type="number" min="50.00" max="200.00" required step="0.01" class="w5">
                        </div>
            
                    </div>    
                    `;
                });
            }
        });

        this.insApts_FloorsInputNameIterator++;
        return aptsDivs;
    }

    /**
     * just an overlay that contains hidden forms
     * @returns promesse to chain actions
     */
    newDeal() {
        const newDeal_formsOverlay = document.createElement("div");
        this.newDeal_formsOverlay_id = "newDeal_formsOverlay";
        newDeal_formsOverlay.id = this.newDeal_formsOverlay_id;
        newDeal_formsOverlay.classList.add("overlay", "hidden", "flex-center");
        this.hideOverlayEventListener(newDeal_formsOverlay);

        // create client + assign house || assign house to existent client
        this.newDeal_appendReserveForm(newDeal_formsOverlay);

        document.body.appendChild(newDeal_formsOverlay);

        return Promise.resolve("add event listeners");
    }

    /**
     *
     * @param {HTMLDivElement} container
     */
    newDeal_appendReserveForm(container) {
        this.newDeal_reserveFormsContainer_id = "newDeal_reserveFormsContainer";
        this.newDeal_reserveResultDiv_id = "newDeal_reserveResultDiv";

        const newDeal_reserveForm_div = `
        <div class="bg-w center-xy">
        <div id="${this.newDeal_reserveFormsContainer_id}" class="hidden flex">
            <form onsubmit="newDeal_reserveToNewClientForm_onsubmit(event)" class="p1 ph2">

            <div class="inline ml1">            
                <label required for="client_lname"><i class="fas fa-user-alt"></i> Nom</label>
                <input name="client_lname" type="text" required >
            </div>
                
            <div class="inline ml1">                
                <label required for="client_fname"><i class="fas fa-user-alt"></i> Prénom</label>
                <input name="client_fname" type="text" required >
            </div><br>

            <div class="inline ml1">                
                <label required for="client_birthday"><i class="fas fa-birthday-cake"></i> Date de naissance</label>
                <input name="client_birthday" type="date" required>
            </div>

            <div class="inline ml1">                
                <label required for="client_birthplace"><i class="fas fa-hospital"></i> Lieu de naissance</label>
                <input name="client_birthplace" type="text" required>
            </div><br>

            <div class="inline ml1">                
                <label required for="client_father_fname"><i class="fas fa-male"></i> Prénom du père</label>
                <input name="client_father_fname" type="text" required>
            </div>

            <div class="inline ml1">                
                <label required for="client_mother_name"><i class="fas fa-female"></i> Nom complet de la mère</label>
                <input name="client_mother_name" type="text" required>
            </div><br>

            <div class="inline ml1">                
                <label required for="client_cni_number"><i class="fas fa-id-card"></i> CNI n°</label>
                <input name="client_cni_number" type="text" required pattent="[0-9]+">
            </div>

            <div class="inline ml1">                
                <label required for="client_cni_date"><i class="fas fa-id-card"></i> CNI délivrée le</label>
                <input name="client_cni_date" type="date" required>
            </div><br>

            <div class="inline ml1">                
                <label required for="client_address"><i class="fas fa-map-marked-alt"></i> Adresse</label>
                <input name="client_address" type="text" required class="w25">
            </div><br>

            <div class="inline ml1">                
                <label required for="client_phone"><i class="fas fa-mobile-alt"></i> Téléphone</label>
                <input name="client_phone" type="tel" required>
            </div>

            <div class="inline ml1">                
                <label required for="client_email"><i class="fas fa-envelope"></i> Email</label>
                <input name="client_email" type="email" required>
            </div><br>

            <div class="inline ml1">                
                <label required for="client_marital_status"><i class="fas fa-user-alt"></i> Etat civil</label>
                <select name="client_marital_status" required>
                    <option disabled selected value> -- Etat civil -- </option>
                    <option value="Célibataire">Célibataire</option>
                    <option value="Marié(e)">Marié(e)</option>
                    <option value="Séparé(e)">Séparé(e)</option>
                    <option value="Divorcé(e)">Divorcé(e)</option>
                    <option value="Veuf ou veuve">Veuf ou veuve</option>
                </select>
            </div><br>
                
            <div class="inline ml1">                
                <label for="client_profession"><i class="fas fa-suitcase"></i> Profession</label>
                <input name="client_profession" type="text">
            </div>
                
            <div class="inline ml1">                
                <label for="client_income"><i class="fas fa-wallet"></i> Revenu</label>
                <input name="client_income" type="number" min="0" max="1000000000" class="w9">
            </div><br>
                
            <div class="inline ml1">                
                <label required for="payment"><i class="fas fa-cash-register"></i> Montant</label>
                <input name="payment" type="number" min="100000" max="10000000" required class="w9">
            </div>

            <div class="flex-row-base ml1">                
                <label for="payment_type"><i class="fas fa-money-bill"></i> Cache</label>
                <input name="payment_type" type="radio" value="cache" required class="w3"/>            
                <label for"=payment_type"><i class="fas fa-money-check"></i> Bank</label>
                <input name="payment_type" type="radio" value="bank" required class="w3"/>
            </div>

            <div class="ml1">                
                <button type="submit" class="inline wp1 btn add-btn"><i class="fas fa-user-plus"></i><i class="fas fa-scroll"></i> Nouveau client et accord</button>
            </div>

            </form>
            <hr>
            <form onsubmit="newDeal_reserveToExistantClientForm_onsubmit(event)" class="p1 ph2 bg-lll-grey">
                <label for="client_identifier_key"><i class="fas fa-id-badge"></i> Clé d'identification</label>
                <select name="client_identifier_key">
                    <option value="client_cni_number">CNI n°</option>
                </select>

                <label required for="client_identifier_value"><i class="fas fa-fingerprint"></i> Valeur d'identification</label>
                <input name="client_identifier_value" type="text" required/>

                <label required for="payment"><i class="fas fa-cash-register"></i> Montant</label>
                <input name="payment" type="number" min="100000" max="10000000" required class="w9">

                <label for="payment_type"><i class="fas fa-money-bill"></i> Cache</label>
                <input name="payment_type" type="radio" value="cache" required/>
                <label for"=payment_type"><i class="fas fa-money-check"></i> Bank</label>
                <input name="payment_type" type="radio" value="bank" required/>

                <button type="submit" class="inline wp1 btn add-btn"><i class="fas fa-scroll"></i>  Accord</button>
            </form>
        </div>
        <div id="${this.newDeal_reserveResultDiv_id}" class="center-text p1 ph2 btr"></div>
        </div>
        `;

        container.innerHTML = newDeal_reserveForm_div;
    }

    searchHouse() {
        const searchHouse_div = document.createElement("div");

        this.searchHouse_submitBtn_id = "searchHouse-submit-btn";
        this.searchHouse_resultDiv_id = "searchHouse-result";

        searchHouse_div.innerHTML = `
            <form onsubmit="searchHouse_form_onSubmit(event)">

                <label for="apt_label"><i class="fas fa-home"></i> Apartement</label>
                <input name="apt_label" type="text" required pattern="[a-zA-Z][0-9]?-[1-8]" class="w5"/>

                <label for="floor_nb"><i class="fas fa-layer-group"></i> Etage</label>
                <input name="floor_nb" type="number" required min="1" max="20" class="w4"/>

                <button type="submit" id="${this.searchHouse_submitBtn_id}" class="wp1 btn add-btn"><i class="fas fa-search"></i> Maison</button>

            </form>

            <div id='${this.searchHouse_resultDiv_id}'></div>
        `;

        this.formsContainer.appendChild(searchHouse_div);
    }

    searchHouse_displayResult(aptData) {
        const searchHouse_result_div = document.getElementById(
            this.searchHouse_resultDiv_id
        );
        this.transaction_freeHouse_attr = "transaction_freeHouse";
        this.newDeal_reserveHouse_attr = "newDeal_reserveHouse";

        let table = `
        <table>
            <tr>
                <th>Bloc</th>
                <th>Numéro</th>
                <th>Etage</th>
                <th>Tag maison</th>
                <th>Type</th>
                <th>Surface</th>
                <th>Surface utile</th>
                <th>Etat</th>
            </tr>
            <tr>
                <td>${aptData.bloc_id}</td>
                <td>${aptData.door_number}</td>
                <td>${aptData.floor_nb}</td>
                <td>${aptData.apt_label}</td>
                <td>${aptData.apt_type}</td>
                <td>${aptData.surface}</td>
                <td>${aptData.surface_real}</td>
                <td onclick="newDeal_actionCell_onClick(event)">
                `;

        if (!aptData.client_id) {
            table += `
                    <span ${this.newDeal_reserveHouse_attr} class="clickable-text">Libre</span>`;
        } else {
            table += `
                    <span ${this.transaction_freeHouse_attr} class="clickable-text">Reservé</span>`;
        }

        table += `
                </td>
            </tr>
        </table>
        `;

        searchHouse_result_div.innerHTML = table;
    }

    searchClient() {
        const searchClient_div = document.createElement("div");

        this.searchClient_submitBtn_id = "searchClient-submit-btn";
        this.searchClient_resultDiv_id = "searchClient-result";

        searchClient_div.innerHTML = `
        <form onsubmit="searchClient_form_onsubmit(event)">

            <label for="client_identifier_key"><i class="fas fa-id-badge"></i> Clé d'identification</label>
            <select name="client_identifier_key">
                <option value="client_cni_number">CNI n°</option>
            </select>

            <label required for="client_identifier_value"><i class="fas fa-fingerprint"></i> Valeur d'identification</label>
            <input name="client_identifier_value" type="text" required/>

            <button type="submit" id="${this.searchClient_submitBtn_id}" class="wp1 btn add-btn"><i class="fas fa-search"></i> Transactions</button>

        </form>

        <div id='${this.searchClient_resultDiv_id}'></div>
        `;

        this.formsContainer.appendChild(searchClient_div);
    }

    searchClient_displayResult(clientTransactions) {
        const searchClient_resultDiv = document.getElementById(
            this.searchClient_resultDiv_id
        );

        let table = `
            <table>
                <caption>Transactions</caption>
                <tr>
                    <th>Nom</th>
                    <th>Prenom</th>
                    <th>Apartement</th>
                    <th>Etage</th>
                    <th>Fait le</th>
                    <th>Montant</th>
                    <th>Montant en lettres</th>
                    <th>Payé par</th>
                    <th>Confirmation</th>
                </tr>
            `;
        clientTransactions.forEach((transaction) => {
            table += `
                <tr>
                    <td>${transaction.client_lname}</td>
                    <td>${transaction.client_fname}</td>
                    <td>${transaction.apt_label}</td>
                    <td>${transaction.floor_nb}</td>
                    <td>${transaction.transaction_date}</td>
                    <td>${transaction.payment}</td>
                    <td>${transaction.payment_chars}</td>
                    <td>${transaction.payment_type}</td>
                `;
            if (transaction.payment_confirmed === "0") {
                table += `
                    <td>${ui.transaction_confirmTransactionForm(
                        transaction.transaction_id
                    )}</td>
                </tr>
                `;
            } else if (transaction.payment_confirmed === "1") {
                table += `
                    <td>Confirmé</td>
                </tr>
                `;
            }
        });
        table += "</table>";
        searchClient_resultDiv.innerHTML = table;

        return Promise.resolve("cofirmation event listener");
    }

    transaction_confirmTransactionForm(transactionId) {
        const transaction_confirmTransactionFormContainer = `
            <form onsubmit="transaction_confirmTransactionForm_onsubmit(event)">
                <input type="hidden" name="transaction_id" value="${transactionId}"/>
                <input type="password" name="pwd"  autocomplete class="w5"/>
                <button type="submit" class="wp1 btn critical-btn"><i class="fas fa-stamp"></i> Confirmer</button>
            </form>
        `;

        return transaction_confirmTransactionFormContainer;
    }

    displayFreeHouses(freeAptsData) {
        const displayFreeHouses_div = document.createElement("div");

        let table = `
        <table>
            <caption>La liste des maisons libres</caption>
            <tr>
                <th>Bloc</th>
                <th>Numéro</th>
                <th>Etage</th>
                <th>Tag maison</th>
                <th>Type</th>
                <th>Surface</th>
                <th>Surface utile</th>
            </tr>
        `;
        freeAptsData.forEach((house) => {
            table += `
            <tr>
                <td>${house.bloc_id}</td>
                <td>${house.door_number}</td>
                <td class="bold">${house.floor_nb}</td>
                <td class="bold">${house.apt_label}</td>
                <td>${house.apt_type}</td>
                <td>${house.surface}</td>
                <td>${house.surface_real}</td>
            </tr>
            `;
        });
        table += "</table>";
        displayFreeHouses_div.innerHTML = table;

        this.formsContainer.appendChild(displayFreeHouses_div);
    }

    /**
     *
     * @param {object} reportObj contains 2 keys:
     * - REPORT: specifies the nature
     * - CONTENT: Contains the message
     */
    appendReportDiv(reportObj) {
        const report = document.createElement("div");
        let icon;
        if (reportObj.REPORT === "SUCCESSFUL_INSERTION") {
            report.classList.add("report", "success-report");
            icon = "<i class='fas fa-check-double'></i> ";
        }
        //
        else if (reportObj.REPORT === "INVALID_DATA") {
            report.classList.add("report", "invalid-input-report");
            icon = "<i class='fas fa-times-circle'></i> ";
        }
        //
        else if (reportObj.REPORT === "MISSING_DATA") {
            report.classList.add("report", "missing-input-report");
            icon = "<i class='fas fa-times-circle'></i> ";
        }
        //
        else if (
            reportObj.REPORT === "ERROR" ||
            reportObj.REPORT === "INTERNAL_ERROR"
        ) {
            report.classList.add("report", "err-report");
            icon = "<i class='fas fa-exclamation-triangle'></i> ";
        }
        //
        else if (reportObj.REPORT === "NOTICE") {
            report.classList.add("report", "notice");
            icon = "<i class='fas fa-exclamation'></i> ";
        }

        if (this.reportsContainer.classList.contains("hidden")) {
            if (reportObj.REPORT === "SUCCESSFUL_INSERTION") {
                this.reportDivToggler.style.background = "green";
            } else {
                this.reportDivToggler.style.background = "orange";
            }
        }

        const now = new Date();
        const timing = `${now.getDate()}/${
            now.getMonth() + 1
        }/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

        report.innerHTML = timing + "<br>" + icon + reportObj.CONTENT;
        this.reportsContainer.prepend(report);
    }

    appendReportDivToggler() {
        this.reportDivToggler = document.createElement("div");
        this.reportDivToggler.classList.add(
            "reports-toggler",
            "header5",
            "pointer"
        );
        this.reportDivToggler.innerHTML =
            "<i class='fas fa-angle-double-left'></i>";

        document.querySelector("main").appendChild(this.reportDivToggler);

        return Promise.resolve("add event listener");
    }

    /**
     * @param {string} currentHash
     */
    highlightasideMenuLocation(currentHash) {
        // Avoid root location causing undefined hash
        if (currentHash === "") return;
        const asideMenu = document.querySelector("aside");
        const menuTarget = document.querySelector(`[href='${currentHash}']`);

        const children = Array.from(asideMenu.children);
        children.forEach((child) => {
            child.classList.remove("aside-focused-section");

            const grandChildren = Array.from(child.children);
            grandChildren.forEach((grandChild) => {
                grandChild.classList.remove("aside-focused-href");
            });
        });

        menuTarget.classList.add("aside-focused-href");
        menuTarget.parentElement.classList.add("aside-focused-section");
    }

    /**
     *
     * @param {HTMLDivElement} overlay
     */
    hideOverlayEventListener(overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) overlay.classList.add("hidden");
        });
    }
}

class FormSubmitter {
    constructor() {
        this.baseUrl = location.origin;
    }

    insBloc_submit(formData, submitBtn) {
        this.submit(formData, "/Apis_blocks/insert_block", submitBtn);
    }

    insApts_submit(formData, submitBtn) {
        this.submit(formData, "/Apis_blocks/insert_apts", submitBtn);
    }

    submit(formData, api, submitBtn) {
        fetch(`${this.baseUrl}${api}`, {
            method: "post",
            body: formData,
        })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                this.formSubmitIncomeAction(json, submitBtn);
            })
            .catch((err) => {
                throw err;
            });
    }

    async insNewClient(formData) {
        const res = await fetch(`${this.baseUrl}/Apis_blocks/insert_client`, {
            method: "post",
            body: formData,
        });
        return await res.json();
    }

    async newDeal(formData) {
        const res = await fetch(`${this.baseUrl}/Apis_transactions/new_deal`, {
            method: "post",
            body: formData,
        });
        return await res.json();
    }

    async confirmTransaction(formData) {
        const res = await fetch(
            `${this.baseUrl}/Apis_transactions/confirm_transaction`,
            {
                method: "post",
                body: formData,
            }
        );
        return await res.json();
    }

    /**
     * Display servers' answer and:
     * - Refresh the page if the submission was successful
     * - Redisplay the submit button to ressubmit the corrected form
     * @param {object} json server response {REPORT, CONTENT}
     * @param {HTMLButtonElement} submitBtn
     */
    formSubmitIncomeAction(json, submitBtn) {
        ui.appendReportDiv(json);

        if (json.REPORT === "SUCCESSFUL_INSERTION")
            setTimeout(() => {
                window.location = window.location.origin;
            }, 3000);
        else {
            submitBtn.style.display = "block";
        }
    }
}

class Fetcher {
    constructor() {
        this.baseUrl = location.origin;
    }

    async getBlocs() {
        const res = await fetch(`${this.baseUrl}/Apis_blocks/get_blocs`);
        return await res.json();
    }

    async getFreeHouses() {
        const res = await fetch(`${this.baseUrl}/Apis_blocks/get_free_houses`);
        return await res.json();
    }

    async getHouse(formData) {
        const aptLabel = formData.get("apt_label");
        const floorNb = formData.get("floor_nb");
        const res = await fetch(
            `${this.baseUrl}/Apis_blocks/search_house/${aptLabel}/${floorNb}`
        );
        return await res.json();
    }

    async getClientDeals(formData) {
        const key = formData.get("client_identifier_key");
        const value = formData.get("client_identifier_value");
        const res = await fetch(
            `${this.baseUrl}/Apis_transactions/get_client_deals/${key}/${value}`
        );
        return await res.json();
    }

    /**
     * JOIN bloc_id
     * @param {object} json
     * @returns
     */
    joinAptsToBloc(json) {
        const jsonBlocs = json[0];
        const jsonApts = json[1];

        const blocs = [];

        jsonBlocs.forEach((bloc) => {
            let temp = {};
            temp.bloc_id = bloc.bloc_id;
            temp.floors_nb = bloc.floors_nb;
            temp.has_houses = bloc.has_houses;
            temp.apts = [];

            jsonApts.forEach((apt) => {
                if (bloc.bloc_id === apt.bloc_id) {
                    temp.apts.push([..."", apt.apt_label, apt.apt_type]);
                }
            });

            blocs.push(temp);
        });

        return blocs;
    }
}
// *****************************************************
//                  MAIN SCOPE
// *****************************************************

const ui = new UI(
    document.querySelector("#forms-container"),
    document.querySelector("#reports-container")
);
const fetcher = new Fetcher();
const formSubmitter = new FormSubmitter();

const state = {};

ui.appendReportDivToggler().then(reportDivToggler_eventListener);

// state variable
let tempBlocsData = null;

window.onhashchange = () => {
    locationChanges();
};
window.onload = () => {
    locationChanges();
};
function locationChanges() {
    ui.reset();

    const hash = window.location.hash;

    ui.highlightasideMenuLocation(hash);

    if (hash === "#init-deal") {
        ui.newDeal();
        ui.searchHouse();
    } else if (hash === "#client-transactions") {
        ui.searchClient();
    } else if (hash === "#list-apt-free") {
        fetcher
            .getFreeHouses()
            .then((json) => {
                // console.log(json);
                if (json.REPORT === "SUCCESSFUL_FETCH") {
                    ui.displayFreeHouses(json.CONTENT);
                } else {
                    defaultReportsHandling(json);
                }
            })
            .catch((err) => {
                console.warn(err);
            });
    } else if (hash === "#ins-bloc") {
        ui.insBloc();
    } else if (hash === "#ins-apt") {
        fetcher
            .getBlocs()
            .then((json) => {
                // console.log(json);
                if (json.REPORT === "SUCCESSFUL_FETCH") {
                    const blocs = fetcher.joinAptsToBloc(json.CONTENT);
                    state.blocsData = blocs;
                    ui.insApts(blocs);
                } else {
                    defaultReportsHandling(json);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }
}

/**
 *
 * @param {SubmitEvent} e
 */
function insBloc_form_submit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById(ui.insBloc_submitBtn_id);
    submitBtn.style.display = "none";
    formSubmitter.insBloc_submit(new FormData(e.target), submitBtn);
}

/**
 *
 * @param {SubmitEvent} e
 */
function insApts_form_submit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById(ui.insApts_submitBtn_id);
    submitBtn.style.display = "none";
    formSubmitter.insApts_submit(new FormData(e.target), submitBtn);
}

/**
 *
 * @param {SubmitEvent} e
 */
function searchHouse_form_onSubmit(e) {
    e.preventDefault();

    const searchBtn = document.getElementById(ui.searchHouse_submitBtn_id);
    searchBtn.style.display = "none";

    fetcher
        .getHouse(new FormData(e.target))
        .then((json) => {
            document.getElementById(ui.searchHouse_resultDiv_id).innerHTML = "";
            searchBtn.style.display = "block";

            if (json.REPORT === "SUCCESSFUL_FETCH") {
                state.house_code = json.CONTENT.house_code;
                ui.searchHouse_displayResult(json.CONTENT);
            } else {
                defaultReportsHandling(json);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

/**
 *
 * @param {MouseEvent} e
 */
function newDeal_actionCell_onClick(e) {
    const newDeal_formsOverlay = document.getElementById(
        ui.newDeal_formsOverlay_id
    );
    const newDeal_reserveFormsContainer = document.getElementById(
        ui.newDeal_reserveFormsContainer_id
    );

    if (e.target.hasAttribute(ui.transaction_freeHouse_attr)) {
        newDeal_formsOverlay.classList.remove("hidden");
        newDeal_reserveFormsContainer.classList.add("hidden");
    } else if (e.target.hasAttribute(ui.newDeal_reserveHouse_attr)) {
        newDeal_formsOverlay.classList.remove("hidden");
        newDeal_reserveFormsContainer.classList.remove("hidden");
    }
}

/**
 *
 * @param {SubmitEvent} e
 */
function newDeal_reserveToNewClientForm_onsubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    formSubmitter
        .insNewClient(formData)
        .then((json) => {
            if (json.REPORT === "SUCCESSFUL_INSERTION") {
                const clientCniNumber = json.CONTENT;
                const report = {
                    REPORT: "SUCCESSFUL_INSERTION",
                    CONTENT: `Le client portant la carte ${clientCniNumber} est enregistré avec succes`,
                };
                ui.appendReportDiv(report);
                return Promise.resolve(clientCniNumber);
            } else {
                defaultReportsHandling(json);
            }
            return Promise.reject("didn't register new client");
        })
        .then((clientCniNumber) => {
            const newDeal_formData = new FormData();
            newDeal_formData.append(
                "client_identifier_key",
                "client_cni_number"
            );
            newDeal_formData.append("client_identifier_value", clientCniNumber);
            newDeal_formData.append("house_code", state.house_code);
            newDeal_formData.append("payment", formData.get("payment"));
            newDeal_formData.append(
                "payment_chars",
                formData.get("payment_chars")
            );
            newDeal_formData.append(
                "payment_type",
                formData.get("payment_type")
            );

            return formSubmitter.newDeal(newDeal_formData);
        })
        .then(newDeal_newDealResult)
        .catch((err) => {
            console.error(err);
        });
}

/**
 *
 * @param {SubmitEvent} e
 */
function newDeal_reserveToExistantClientForm_onsubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("house_code", state.house_code);

    formSubmitter.newDeal(formData).then(newDeal_newDealResult);
}

function newDeal_newDealResult(firstTransaction) {
    if (firstTransaction.REPORT === "SUCCESSFUL_INSERTION") {
        const transactionId = firstTransaction.CONTENT.transaction_id;

        const report = {
            REPORT: "SUCCESSFUL_INSERTION",
            CONTENT: `La transaction ${transactionId} est enregistré avec succes`,
        };
        ui.appendReportDiv(report);

        document.getElementById(
            ui.newDeal_reserveResultDiv_id
        ).innerHTML = `<a href="${fetcher.baseUrl}/Apis_pdf/ordre/${transactionId}" target="_blank" class="clickable-text"><i class="fas fa-file-pdf"></i>  ORDRE DE VERSEMENT</a>`;
    } else {
        defaultReportsHandling(firstTransaction);
    }
}

/**
 *
 * @param {SubmitEvent} e
 */
function searchClient_form_onsubmit(e) {
    e.preventDefault();

    const searchBtn = document.getElementById(ui.searchClient_submitBtn_id);
    searchBtn.style.display = "none";

    fetcher
        .getClientDeals(new FormData(e.target))
        .then((json) => {
            document.getElementById(ui.searchClient_resultDiv_id).innerHTML =
                "";
            searchBtn.style.display = "block";

            if (json.REPORT === "SUCCESSFUL_FETCH") {
                ui.searchClient_displayResult(json.CONTENT);
            } else {
                defaultReportsHandling(json);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

/**
 *
 * @param {SubmitEvent} e
 */
function transaction_confirmTransactionForm_onsubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    formSubmitter.confirmTransaction(formData).then((json) => {
        if (
            json.REPORT === "SUCCESSFUL_FETCH" &&
            Number.isInteger(json.CONTENT)
        ) {
            e.target.parentElement.innerHTML = `
                <a href='${location.origin}/Apis_pdf/versement/${json.CONTENT}' target='_blank' class="clickable-text"><i class="fas fa-file-pdf"></i> RECU DE VERSEMENT</a>
                <br>
                <a href='${location.origin}/Apis_pdf/reservation/${json.CONTENT}' target='_blank' class="clickable-text"><i class="fas fa-file-pdf"></i> CONTRAT DE RESERVATION</a>
                `;
        }
    });
}

function reportDivToggler_eventListener() {
    ui.reportDivToggler.addEventListener("click", () => {
        const icon = ui.reportDivToggler.querySelector("i");
        ui.reportDivToggler.style.background = "var(--primary-color)";

        ui.reportsContainer.classList.toggle("hidden");
        if (ui.reportsContainer.classList.contains("hidden")) {
            icon.classList.add("fa-angle-double-left");
            icon.classList.remove("fa-angle-double-right");
        } else {
            icon.classList.remove("fa-angle-double-left");
            icon.classList.add("fa-angle-double-right");
        }
    });
}

function defaultReportsHandling(json) {
    const reportAll = true;

    if (json.REPORT === "NOTICE") {
        ui.appendReportDiv(json);
    } else if (reportAll) {
        ui.appendReportDiv(json);
    } else {
        console.warn("Unexpected response");
    }
}
