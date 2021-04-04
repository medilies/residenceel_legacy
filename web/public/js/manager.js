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

        this.insBloc_form_id = "insBloc";
        this.insBloc_blocIdInput_id = "insBloc-bloc";
        this.insBloc_addApt_attr = "insBloc_addApt";
        this.insBloc_rmApt_attr = "insBloc_rmApt";
        this.insBloc_submitBtn_id = "insBloc-submit-btn";
        this.insBloc_aptContainerDiv_id = "insBloc-apt-container";

        insBloc_div.innerHTML = `
            <form id="${this.insBloc_form_id}">

                <label for="bloc_id">Nom du bloc</label>
                <input name="bloc_id" id="${this.insBloc_blocIdInput_id}" type="text" placeholder="A1..." required pattern="[a-zA-Z][0-9]?" class="w5 first-input"/>
                
                <label for="floors_nb">Nombre des étages</label>
                <input name="floors_nb" type="number" min="5" max="20" placeholder="5..." required class="w3"/>
                
                <button name="insBloc" type="button" ${this.insBloc_addApt_attr} class="btn add-btn inline wp1"><i class="fas fa-plus-square"></i> Apartement</button>

                <button type="button" ${this.insBloc_rmApt_attr} class="btn rm-btn wp1 inline"><i class="fas fa-minus-square"></i> Apartement</button>

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

        return Promise.resolve("add eventListeners");
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

        /**
         * Targets identifiers
         */
        this.insApts_form_id = "insApts";
        this.insApts_selectBloc_id = "insApts-select-bloc";
        this.insApts_addFloors_attr = "insApts_AddFloors";
        this.insApts_rmFloor_attr = "insApts_rmFloor";
        this.insApts_submitBtn_id = "insApts_submit-btn";
        this.insApts_floorsContainerDiv_id = "insApts-floors-container";

        // Create form with container for adding floors & apts
        const insApt_div = document.createElement("div");
        insApt_div.innerHTML = `
        <form id="${this.insApts_form_id}">
            <label for"bloc_id">Bloc</label>
            <select name="bloc_id" required class="w5 first-input" id="${
                this.insApts_selectBloc_id
            }">
            ${blocsData.map((bloc) => {
                if (bloc.has_houses === "0")
                    return `<option value="${bloc.bloc_id}">${bloc.bloc_id}</option>`;
            })}
            </select>

            <button type="button" class="inline wp1 btn add-btn" ${
                this.insApts_addFloors_attr
            }><i class="fas fa-plus-square"></i> Série d'étages</button>

            <button type="button" class="inline wp1 btn rm-btn" ${
                this.insApts_rmFloor_attr
            }><i class="fas fa-minus-square"></i> Série d'étages</button>

            <div id="${
                this.insApts_floorsContainerDiv_id
            }" class="bg-l-grey br1 p05 mb1"></div>
            
            <button id="${
                this.insApts_submitBtn_id
            }" type="submit" class="inline wp1 btn add-btn"><i class="fas fa-check-square"></i> Enregistrer</button>
        </form>
        `;

        this.formsContainer.appendChild(insApt_div);

        return Promise.resolve("add eventListeners");
    }

    insApts_addFloor(blocsData) {
        if (this.insApts_FloorsInputNameIterator >= 5) return;

        const floorsContainer = document.getElementById(
            this.insApts_floorsContainerDiv_id
        );

        // will iterate inside insApts_floorApts()
        const i = this.insApts_FloorsInputNameIterator;

        const floors = document.createElement("div");
        floors.classList.add("card", "mt1", "mb1");
        floors.innerHTML = `
        <label for="floors">Serie d'étages</label>
        <input name="floors[${i}][floors]" placeholder="3;5;6;9;..." pattern="([0-9]+;)*[0-9]+(;)?" required class="inline"/>
        
        ${this.insApts_floorApts(blocsData)}
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
    transaction() {
        const transaction_formsOverlay = document.createElement("div");
        this.transaction_formsOverlay_id = "transaction_formsOverlay";
        transaction_formsOverlay.id = this.transaction_formsOverlay_id;
        transaction_formsOverlay.classList.add(
            "overlay",
            "hidden",
            "flex-center"
        );
        this.hideOverlayEventListener(transaction_formsOverlay);

        this.transaction_appendReserveForm(transaction_formsOverlay);

        document.body.appendChild(transaction_formsOverlay);

        return Promise.resolve("add event listeners");
    }

    /**
     *
     * @param {HTMLDivElement} container
     */
    transaction_appendReserveForm(container) {
        this.transaction_reserveFormsContainer_id =
            "transaction_reserveFormsContainer";
        this.transaction_reserveToNewClientForm_id =
            "transaction_reserveToNewClientForm";
        this.transaction_reserveToExistantClientForm_id =
            "transaction_reserveToExistantClientForm";

        const transaction_reserveForm_div = `
        <div class="bg-w p1 center-xy">
        <div id="${this.transaction_reserveFormsContainer_id}" class="hidden flex">
            <form id="${this.transaction_reserveToNewClientForm_id}" class="flex">
            <div>
                <label for="client_lname">Nom</label>
                <input name="client_lname" type="text" required >
                
                <label for="client_fname">Prenom</label>
                <input name="client_fname" type="text" required >

                <label for="client_birthday">Date de naissance</label>
                <input name="client_birthday" type="date" required>

                <label for="client_birthplace">Lieu de naissance</label>
                <input name="client_birthplace" type="text">

                <label for="client_father_fname">Prenom du père</label>
                <input name="client_father_fname" type="text">

                <label for="client_mother_name">Nom complet de la mère</label>
                <input name="client_mother_name" type="text">

                <label for="client_cni_number">CNI n°</label>
                <input name="client_cni_number" type="text" required pattent="[0-9]+">

                <label for="client_cni_date">CNI délivré le</label>
                <input name="client_cni_date" type="date">

                <label for="client_address">Adresse</label>
                <input name="client_address" type="text" required >
            </div>
            <div>
                <label for="client_phone">Telephone</label>
                <input name="client_phone" type="tel" required>

                <label for="client_email">email</label>
                <input name="client_email" type="email" required>

                <label for="client_marital_status">Etat civil</label>
                <input name="client_marital_status" type="text" required>
                
                <label for="client_profession">Profession</label>
                <input name="client_profession" type="text">
                
                <label for="client_income">Revenu</label>
                <input name="client_income" type="text">
                
                <label for="payment">Montant</label>
                <input name="payment" type="number" required>

                <label for="payment_chars">Montant en lettre</label>
                <input name="payment_chars" type="text">

                <label for="payment_type">Cache</label>
                <input name="payment_type" type="radio" value="cache" required/>
                <label for"=payment_type">Bank</label>
                <input name="payment_type" type="radio" value="bank" required/>

                <button type="submit" class="inline wp1 btn add-btn">Nouveau client + accord</button>
            </div>
            </form>
            <hr>
            <form id="${this.transaction_reserveToExistantClientForm_id}">
                <label for="client_identifier_key">Clé</label>
                <select name="client_identifier_key">
                    <option value="client_cni_number">CNI n°</option>
                </select>

                <label for="client_identifier_value">Valeur</label>
                <input name="client_identifier_value" type="text" required/>

                <label for="payment">Montant</label>
                <input name="payment" type="number" required>

                <label for="payment_chars">Montant en lettre</label>
                <input name="payment_chars" type="text">

                <label for="payment_type">Cache</label>
                <input name="payment_type" type="radio" value="cache" required/>
                <label for"=payment_type">Bank</label>
                <input name="payment_type" type="radio" value="bank" required/>

                <button type="submit" class="inline wp1 btn add-btn">Accord</button>
            </form>
        </div>
        </div>
        `;

        container.innerHTML = transaction_reserveForm_div;
    }

    transaction_confirmTransactionForm(transactionId, aptLabel, floorNb) {
        // const transaction_confirmTransactionFormContainer = document.createElement(
        //     "div"
        // );

        this.transaction_confirmTransactionForm_attr =
            "transaction_confirmTransactionForm";

        const transaction_confirmTransactionFormContainer = `
            <form ${this.transaction_confirmTransactionForm_attr}>
                <input type="hidden" name="transaction_id" value="${transactionId}"/>
                <input type="hidden" name="apt_label" value="${aptLabel}"/>
                <input type="hidden" name="floor_nb" value="${floorNb}"/>
                <input type="password" name="pwd"  autocomplete />
                <button type="submit">Confirmer</button>
            </form>
        `;

        return transaction_confirmTransactionFormContainer;
    }

    searchHouse() {
        const searchHouse_div = document.createElement("div");

        this.searchHouse_form_id = "searchHouse";
        this.searchHouse_submitBtn_id = "searchHouse-submit-btn";
        this.searchHouse_resultDiv_id = "searchHouse-result";

        searchHouse_div.innerHTML = `
            <form id="${this.searchHouse_form_id}">

                <label for="apt_label">Apartement</label>
                <input name="apt_label" type="text" required pattern="[a-zA-Z][0-9]?-[1-8]" class="w5"/>

                <label for="floor_nb">Etage</label>
                <input name="floor_nb" type="number" required min="1" max="20" class="w4"/>

                <button type="submit" id="${this.searchHouse_submitBtn_id}" class="wp1 btn add-btn"><i class="fas fa-search"></i> Maison</button>

            </form>

            <div id='${this.searchHouse_resultDiv_id}'></div>
        `;

        this.formsContainer.appendChild(searchHouse_div);

        return Promise.resolve("add eventListeners");
    }

    searchHouse_displayResult(aptData) {
        const searchHouse_result_div = document.getElementById(
            this.searchHouse_resultDiv_id
        );
        this.transaction_actionCell_id = "transaction_actionCell";
        this.transaction_freeHouse_attr = "transaction_freeHouse";
        // this.transaction_sellHouse_attr = "transaction_sellHouse";
        this.transaction_reserveHouse_attr = "transaction_reserveHouse";

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
                <td>${aptData.surface_real}</td>`;

        if (!aptData.client_id) {
            table += `
                <td id="${this.transaction_actionCell_id}">
                    <span ${this.transaction_reserveHouse_attr} class="clickable-text">Libre</span>
                </td>`;
        } else {
            table += `
                <td id="${this.transaction_actionCell_id}">
                    <span ${this.transaction_freeHouse_attr} class="clickable-text">Reservé</span>
                </td>`;
        }

        table += `
            </tr>
        </table>
        `;

        searchHouse_result_div.innerHTML = table;

        return Promise.resolve("add event lsitener to actoin cell");
    }

    searchClient() {
        const searchClient_div = document.createElement("div");

        this.searchClient_form_id = "searchClient";
        this.searchClient_submitBtn_id = "searchClient-submit-btn";
        this.searchClient_resultDiv_id = "searchClient-result";

        searchClient_div.innerHTML = `
        <form id="${this.searchClient_form_id}">

            <label for="client_identifier_key">Clé</label>
            <select name="client_identifier_key">
                <option value="client_cni_number">CNI n°</option>
            </select>

            <label for="client_identifier_value">Valeur</label>
            <input name="client_identifier_value" type="text" required/>

            <button type="submit" id="${this.searchClient_submitBtn_id}" class="wp1 btn add-btn"><i class="fas fa-search"></i> Transactions</button>

        </form>

        <div id='${this.searchClient_resultDiv_id}'></div>
        `;

        this.formsContainer.appendChild(searchClient_div);

        return Promise.resolve("add eventListeners");
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
                        transaction.transaction_id,
                        transaction.apt_label,
                        transaction.floor_nb
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

const reportAll = true;

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
        ui.transaction().then(transaction_eventListeners);
        ui.searchHouse().then(searchHouse_eventListeners);
    } else if (hash === "#client-transactions") {
        ui.searchClient().then(searchClient_eventListeners);
    } else if (hash === "#list-apt-free") {
        fetcher
            .getFreeHouses()
            .then((json) => {
                console.log(json);
                if (json.REPORT === "SUCCESSFUL_FETCH") {
                    ui.displayFreeHouses(json.CONTENT);
                } else if (json.REPORT === "NOTICE") {
                    ui.appendReportDiv(json);
                } else if (reportAll) {
                    ui.appendReportDiv(json);
                }
            })
            .catch((err) => {
                console.warn(err);
            });
    } else if (hash === "#ins-bloc") {
        ui.insBloc().then(insBloc_eventListeners);
    } else if (hash === "#ins-apt") {
        fetcher
            .getBlocs()
            .then((json) => {
                console.log(json);
                if (json.REPORT === "SUCCESSFUL_FETCH") {
                    const blocs = fetcher.joinAptsToBloc(json.CONTENT);
                    tempBlocsData = blocs;
                    ui.insApts(blocs).then(insApts_eventListeners);
                } else if (json.REPORT === "NOTICE") {
                    ui.appendReportDiv(json);
                } else if (reportAll) {
                    ui.appendReportDiv(json);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }
}

function insBloc_eventListeners() {
    const insBloc_form = document.getElementById(ui.insBloc_form_id);

    insBloc_form.addEventListener("submit", (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById(ui.insBloc_submitBtn_id);
        submitBtn.style.display = "none";
        formSubmitter.insBloc_submit(new FormData(insBloc_form), submitBtn);
    });

    insBloc_form.addEventListener("click", (e) => {
        const target = e.target;

        if (target.hasAttribute(ui.insBloc_addApt_attr)) {
            ui.insBloc_addApt();
        } else if (target.hasAttribute(ui.insBloc_rmApt_attr)) {
            ui.insBloc_rmApt();
        }
    });
}

function insApts_eventListeners() {
    const insApt_form = document.getElementById(ui.insApts_form_id);

    insApt_form.addEventListener("submit", (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById(ui.insApts_submitBtn_id);
        submitBtn.style.display = "none";
        formSubmitter.insApts_submit(new FormData(insApt_form), submitBtn);
    });

    insApt_form.addEventListener("click", (e) => {
        const target = e.target;

        if (target.hasAttribute(ui.insApts_addFloors_attr)) {
            ui.insApts_addFloor(tempBlocsData);
        } else if (target.hasAttribute(ui.insApts_rmFloor_attr)) {
            ui.insApts_rmFloor();
        }
    });
}

function searchHouse_eventListeners() {
    const searchHouse_form = document.getElementById(ui.searchHouse_form_id);

    searchHouse_form.addEventListener("submit", (e) => {
        e.preventDefault();

        const searchBtn = document.getElementById(ui.searchHouse_submitBtn_id);
        searchBtn.style.display = "none";

        fetcher
            .getHouse(new FormData(searchHouse_form))
            .then((json) => {
                document.getElementById(ui.searchHouse_resultDiv_id).innerHTML =
                    "";
                searchBtn.style.display = "block";

                if (json.REPORT === "SUCCESSFUL_FETCH") {
                    state.house_code = json.CONTENT.house_code;
                    ui.searchHouse_displayResult(json.CONTENT).then(() => {
                        const actionCell = document.getElementById(
                            ui.transaction_actionCell_id
                        );

                        actionCell.addEventListener("click", (e) => {
                            transaction_formsOverlay.classList.remove("hidden");
                            if (
                                e.target.hasAttribute(
                                    ui.transaction_freeHouse_attr
                                )
                            ) {
                                transaction_reserveFormsContainer.classList.add(
                                    "hidden"
                                );
                                console.log("reserved");
                            } else if (
                                e.target.hasAttribute(
                                    ui.transaction_reserveHouse_attr
                                )
                            ) {
                                transaction_reserveFormsContainer.classList.remove(
                                    "hidden"
                                );
                                console.log("free");
                            }
                        });
                    });
                } else if (json.REPORT === "NOTICE") {
                    ui.appendReportDiv(json);
                } else if (reportAll) {
                    ui.appendReportDiv(json);
                } else {
                    console.warn("Unexpected response");
                }
            })
            .catch((err) => {
                console.error(err);
            });
    });
}

function transaction_eventListeners() {
    const transaction_formsOverlay = document.getElementById(
        ui.transaction_formsOverlay_id
    );
    const transaction_reserveFormsContainer = document.getElementById(
        ui.transaction_reserveFormsContainer_id
    );
    const transaction_reserveToNewClientForm = document.getElementById(
        ui.transaction_reserveToNewClientForm_id
    );
    const transaction_reserveToExistantClientForm = document.getElementById(
        ui.transaction_reserveToExistantClientForm_id
    );

    transaction_reserveToNewClientForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(transaction_reserveToNewClientForm);

        formSubmitter
            .insNewClient(formData)
            .then((json) => {
                // document.getElementById(ui.searchHouse_resultDiv_id).innerHTML =
                //     "";
                // searchBtn.style.display = "block";

                const clientCniNumber = json.CONTENT;

                if (json.REPORT === "SUCCESSFUL_INSERTION") {
                    return Promise.resolve(clientCniNumber);
                } else if (json.REPORT === "NOTICE") {
                    ui.appendReportDiv(json);
                } else if (reportAll) {
                    ui.appendReportDiv(json);
                } else {
                    console.warn("Unexpected response");
                }
            })
            .then((clientCniNumber) => {
                console.log(clientCniNumber);

                const newDeal_formData = new FormData();
                newDeal_formData.append(
                    "client_identifier_key",
                    "client_cni_number"
                );
                newDeal_formData.append(
                    "client_identifier_value",
                    clientCniNumber
                );
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
            .then(transaction_newDealResult)
            .catch((err) => {
                console.error(err);
            });
    });
    transaction_reserveToExistantClientForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(transaction_reserveToExistantClientForm);
        formData.append("house_code", state.house_code);

        formSubmitter.newDeal(formData).then(transaction_newDealResult);
    });
}

function transaction_newDealResult(firstTransaction) {
    if (firstTransaction.REPORT === "SUCCESSFUL_INSERTION") {
        const transactionId = firstTransaction.CONTENT.transaction_id;

        const report = {
            REPORT: "SUCCESSFUL_INSERTION",
            CONTENT: `La transaction ${transactionId} est enregistré avec succes`,
        };
        ui.appendReportDiv(report);

        const pdfLink = document.createElement("span");
        pdfLink.innerHTML = `<a href="${fetcher.baseUrl}/Apis_pdf/ordre/${transactionId}" target="_blank" class="clickable-text">Ordre de versement</a>`;
        transaction_reserveFormsContainer.appendChild(pdfLink);
    } else if (firstTransaction.REPORT === "ERROR") {
        ui.appendReportDiv(firstTransaction);
    } else if (reportAll) {
        ui.appendReportDiv(firstTransaction);
    } else {
        console.warn("Unexpected response");
    }
}

function searchClient_eventListeners() {
    const searchClient_form = document.getElementById(ui.searchClient_form_id);

    searchClient_form.addEventListener("submit", (e) => {
        e.preventDefault();

        const searchBtn = document.getElementById(ui.searchClient_submitBtn_id);
        searchBtn.style.display = "none";

        fetcher
            .getClientDeals(new FormData(searchClient_form))
            .then((json) => {
                document.getElementById(
                    ui.searchClient_resultDiv_id
                ).innerHTML = "";
                searchBtn.style.display = "block";

                if (json.REPORT === "SUCCESSFUL_FETCH") {
                    state.house_code = json.CONTENT.house_code;
                    ui.searchClient_displayResult(json.CONTENT);
                } else if (json.REPORT === "NOTICE") {
                    ui.appendReportDiv(json);
                } else if (reportAll) {
                    ui.appendReportDiv(json);
                } else {
                    console.warn("Unexpected response");
                }
            })
            .then(transaction_confirmTransaction_eventLitener)
            .catch((err) => {
                console.error(err);
            });
    });
}

function transaction_confirmTransaction_eventLitener() {
    const transaction_confirmation_forms = document.querySelectorAll(
        `[${ui.transaction_confirmTransactionForm_attr}]`
    );

    transaction_confirmation_forms.forEach((transaction_confirmation_form) => {
        transaction_confirmation_form.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData(transaction_confirmation_form);

            formSubmitter.confirmTransaction(formData).then((json) => {
                if (
                    json.REPORT === "SUCCESSFUL_FETCH" &&
                    Number.isInteger(json.CONTENT)
                ) {
                    e.target.parentElement.innerHTML = `
                    <a href='${location.origin}/Apis_pdf/versement/${json.CONTENT}' target='_blank' class="clickable-text">RECU DE VERSEMENT</a>
                    <br>
                    <a href='${location.origin}/Apis_pdf/reservation/${json.CONTENT}' target='_blank' class="clickable-text">CONTRAT DE RESERVATION</a>
                    `;
                }
            });
        });
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
