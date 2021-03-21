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

    searchApt() {
        const searchApt_div = document.createElement("div");

        this.searchApt_form_id = "searchApt";
        this.searchApt_submitBtn_id = "searchApt-submit-btn";
        this.searchApt_resultDiv_id = "searchApt-result";

        searchApt_div.innerHTML = `
            <form id="${this.searchApt_form_id}">

                <label for="apt_label">Apartement</label>
                <input name="apt_label" type="text" required pattern="[a-zA-Z][0-9]?-[1-8]" class="w5"/>

                <label for="floor_nb">Etage</label>
                <input name="floor_nb" type="number" required min="1" max="20" class="w4"/>

                <button type="submit" id="${this.searchApt_submitBtn_id}" class="wp1 btn add-btn"><i class="fas fa-search"></i> Chercher</button>

            </form>

            <div id='${this.searchApt_resultDiv_id}'></div>
        `;

        this.formsContainer.appendChild(searchApt_div);

        return Promise.resolve("add eventListeners");
    }

    searchApt_displayResult(aptData) {
        const searchApt_result_div = document.getElementById(
            this.searchApt_resultDiv_id
        );

        const table = `
        <table>
            <tr>
                <th>ID maison</th>
                <th>Bloc</th>
                <th>Etage</th>
                <th>Tag maison</th>
                <th>Type</th>
                <th>Surface</th>
                <th>Surface utile</th>
            </tr>
            <tr>
                <td>${aptData.house_hash}</td>
                <td>${aptData.bloc_id}</td>
                <td>${aptData.floor_nb}</td>
                <td>${aptData.apt_label}</td>
                <td>${aptData.apt_type}</td>
                <td>${aptData.surface}</td>
                <td>${aptData.surface_real}</td>
            </tr>
        </table>
        `;

        searchApt_result_div.innerHTML = table;
    }

    displayFreeHouses(freeAptsData) {
        const displayFreeHouses_div = document.createElement("div");

        let table = `
        <table>
            <caption>La liste des maisons libres</caption>
            <tr>
                <th>ID maison</th>
                <th>Bloc</th>
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
                <td class="tiny-text">${house.house_hash}</td>
                <td>${house.bloc_id}</td>
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
}

class FormSubmitter {
    constructor() {
        this.baseUrl = location.origin;
    }

    insBloc_submit(formData, submitBtn) {
        this.submit(formData, "/apis/insert_block", submitBtn);
    }

    insApts_submit(formData, submitBtn) {
        this.submit(formData, "/apis/insert_apts", submitBtn);
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

    getBlocs() {
        return fetch(`${this.baseUrl}/apis/get_blocs`).then((res) =>
            res.json()
        );
    }

    getFreeHouses() {
        return fetch(`${this.baseUrl}/apis/get_free_houses`).then((res) =>
            res.json()
        );
    }

    getApt(formData) {
        const aptLabel = formData.get("apt_label");
        const floorNb = formData.get("floor_nb");
        return fetch(
            `${this.baseUrl}/apis/search_apt/${aptLabel}/${floorNb}`
        ).then((res) => res.json());
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

    if (hash === "#srch-apt") {
        ui.searchApt().then(searchApt_eventListeners);
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

function searchApt_eventListeners() {
    const searchApt_form = document.getElementById(ui.searchApt_form_id);

    searchApt_form.addEventListener("submit", (e) => {
        e.preventDefault();

        const searchBtn = document.getElementById(ui.searchApt_submitBtn_id);
        searchBtn.style.display = "none";

        fetcher
            .getApt(new FormData(searchApt_form))
            .then((json) => {
                document.getElementById(ui.searchApt_resultDiv_id).innerHTML =
                    "";
                searchBtn.style.display = "block";

                if (json.REPORT === "SUCCESSFUL_FETCH") {
                    ui.searchApt_displayResult(json.CONTENT);
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
