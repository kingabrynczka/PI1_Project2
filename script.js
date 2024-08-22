let currentUnidadeIndex = null;
let currentAvaliacaoIndex = null;


document.addEventListener('DOMContentLoaded', function() {


    function displayUnidadesCurriculares() {
        const listElement = document.getElementById('unit-list');
        listElement.innerHTML = ''; 
        document.getElementById('selected-unit').classList.remove('d-none');  //remove d-none -> para exibir
    
        const unidadesCurriculares = JSON.parse(localStorage.getItem('unidadesCurriculares')) || [];   //if there's no data, the empty array will be assigned to a variable UnidadesCurriculares
    
        if (unidadesCurriculares.length === 0) {
            const message = document.createElement('li'); 
            message.textContent = 'Não há unidades curriculares disponíveis.';
            listElement.appendChild(message);
        } else {
            unidadesCurriculares.forEach((unidade, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerHTML = `
                    <strong class="unit-name" data-index="${index}">Nome:</strong> ${unidade.nome}<br>  <!--it's interactive and needs to know which unit it represents, so then when clicked has to retrieve the unit-->
                    <strong>Ano:</strong> ${unidade.ano}<br>
                    <strong>Semestre:</strong> ${unidade.semestre}<br>
                    <strong>Minutos gastos:</strong> ${unidade.minutos}
                    <button class="btn btn-danger btn-sm float-right" onclick="removeUnidadeCurricular(${index})">Remover</button>
                `;
                listElement.appendChild(listItem);
    
                listItem.querySelector('.unit-name').addEventListener('click', function() {
                    currentUnidadeIndex = this.getAttribute('data-index');

                    const selectedUnitName = document.getElementById('selected-unit-name');
                    selectedUnitName.textContent = unidadesCurriculares[currentUnidadeIndex].nome;

                    displayAvaliacoes(currentUnidadeIndex);
                });

                    listItem.querySelector('.unit-name').style.cursor = 'pointer';
                });
            }
        }

    
        function addAvaliacao() {
            const nomeInput = document.getElementById('avaliacao-nome');
            const nomeAvaliacao = nomeInput.value.trim();
        
            if (!nomeAvaliacao) {
                alert('Por favor, insira o nome da avaliação.');
                return;
            }
        
            const unidadesCurriculares = JSON.parse(localStorage.getItem('unidadesCurriculares')) || [];
            if (currentUnidadeIndex !== null && unidadesCurriculares[currentUnidadeIndex]) {
                const avaliacao = {
                    nome: nomeAvaliacao,
                    registos: [] 
                };
                unidadesCurriculares[currentUnidadeIndex].avaliacoes.push(avaliacao);
                localStorage.setItem('unidadesCurriculares', JSON.stringify(unidadesCurriculares));
                nomeInput.value = ''; 
        
                console.log('Updated unidadesCurriculares:', unidadesCurriculares);
        
                displayAvaliacoes(currentUnidadeIndex);
            }
        }

        function displayAvaliacoes(index) {
            const unidadesCurriculares = JSON.parse(localStorage.getItem('unidadesCurriculares')) || [];
            const selectedUnit = unidadesCurriculares[index];

            const avaliacoesList = document.getElementById('avaliacoes-list');
            avaliacoesList.innerHTML = '';

            if (selectedUnit && selectedUnit.avaliacoes && selectedUnit.avaliacoes.length > 0) {
                selectedUnit.avaliacoes.forEach((avaliacao, idx) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.innerHTML = `
                        <span class="avaliacao-name" data-avaliacao-index="${idx}">${avaliacao.nome}</span>
                        <button class="btn btn-danger btn-sm float-right" onclick="removeAvaliacao(${index}, ${idx})">Remover</button>
                    `;
                    avaliacoesList.appendChild(listItem);

                    listItem.querySelector('.avaliacao-name').addEventListener('click', function() {
                        currentAvaliacaoIndex = this.getAttribute('data-avaliacao-index');
                        displayRegistos(index, currentAvaliacaoIndex);

                        const selectedAvaliacaoName = document.getElementById('selected-avaliacao-name');
                        selectedAvaliacaoName.textContent = avaliacao.nome;
                
                    });
                    listItem.querySelector('.avaliacao-name').style.cursor = 'pointer';
                });
            } else {
                const message = document.createElement('li');
                message.textContent = 'Não há avaliações para esta unidade.';
                avaliacoesList.appendChild(message);
            }

        
            const avaliacoesSection = document.getElementById('avaliacoes-section');
            avaliacoesSection.classList.remove('d-none');
        }

        function displayRegistos(unidadeIndex, avaliacaoIndex) {
            const unidadesCurriculares = JSON.parse(localStorage.getItem('unidadesCurriculares')) || [];
            const selectedAvaliacao = unidadesCurriculares[unidadeIndex].avaliacoes[avaliacaoIndex];

            const registosList = document.getElementById('registos-list');
            registosList.innerHTML = '';

            if (selectedAvaliacao && selectedAvaliacao.registos && selectedAvaliacao.registos.length > 0) {
                selectedAvaliacao.registos.forEach((registo, idx) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.textContent = `${registo.dia} - ${registo.horaInicio} (${registo.duracao} minutos)`;

                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remover';
                    removeButton.className = 'btn btn-danger btn-sm float-right';
                    removeButton.addEventListener('click', function() {
                        removeRegisto(unidadeIndex, avaliacaoIndex, idx);
                    });

                    listItem.appendChild(removeButton);
                    registosList.appendChild(listItem);
                });
            } else {
                const message = document.createElement('li');
                message.textContent = 'Não há registos para esta avaliação.';
                registosList.appendChild(message);
            }

            const registosSection = document.getElementById('registos-section');
            registosSection.classList.remove('d-none');
        }

        function removeRegisto(unidadeIndex, avaliacaoIndex, registoIndex) {
            const unidadesCurriculares = JSON.parse(localStorage.getItem('unidadesCurriculares')) || [];
            if (unidadesCurriculares[unidadeIndex] && unidadesCurriculares[unidadeIndex].avaliacoes[avaliacaoIndex]) {
                const registo = unidadesCurriculares[unidadeIndex].avaliacoes[avaliacaoIndex].registos[registoIndex];
                const minutosRemovidos = parseInt(registo.duracao, 10);
        
                const confirmation = confirm('Tem certeza de que deseja remover este registo?');
                if (!confirmation) {
                    return; 
                }

                unidadesCurriculares[unidadeIndex].minutos -= minutosRemovidos;
                unidadesCurriculares[unidadeIndex].avaliacoes[avaliacaoIndex].minutos -= minutosRemovidos;

                unidadesCurriculares[unidadeIndex].avaliacoes[avaliacaoIndex].registos.splice(registoIndex, 1);
                localStorage.setItem('unidadesCurriculares', JSON.stringify(unidadesCurriculares));

                displayRegistos(unidadeIndex, avaliacaoIndex);
            }
        }
        

        function addUnidadeCurricular() {
            const nomeInput = document.getElementById('unidade-nome');      //inputs do utiliz.
            const anoInput = document.getElementById('unidade-ano');
            const semestreInput = document.getElementById('unidade-semestre');

            const newUnidade = {
                nome: nomeInput.value.trim(),
                ano: anoInput.value,
                semestre: semestreInput.value,
                minutos: '0',
                avaliacoes: [] 
            };

            if (!newUnidade.nome || !newUnidade.ano || !newUnidade.semestre) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const unidadesCurriculares = JSON.parse(localStorage.getItem('unidadesCurriculares')) || [];

            unidadesCurriculares.push(newUnidade);   //new UC esta adicionada ao array Unidades CUrriculares
            localStorage.setItem('unidadesCurriculares', JSON.stringify(unidadesCurriculares));

            nomeInput.value = '';
            anoInput.value = '';
            semestreInput.value = '';
            displayUnidadesCurriculares();
        }

        window.removeUnidadeCurricular = function(index) {  //window->globally accessible, bcs of btns being created dynamically
            if (confirm('Tem certeza de que deseja remover esta unidade curricular?')) {
                const unidadesCurriculares = JSON.parse(localStorage.getItem('unidadesCurriculares')) || [];
                if (unidadesCurriculares.length > index) {
                    unidadesCurriculares.splice(index, 1);  //splice method removes 1 element at specified position
                    localStorage.setItem('unidadesCurriculares', JSON.stringify(unidadesCurriculares));
                    displayUnidadesCurriculares();
                }
            }
        };

        window.removeAvaliacao = function(unidadeIndex, avaliacaoIndex) {
            if (confirm('Tem certeza de que deseja remover esta avaliação?')) {
                const unidadesCurriculares = JSON.parse(localStorage.getItem('unidadesCurriculares')) || [];
                if (unidadesCurriculares[unidadeIndex] && unidadesCurriculares[unidadeIndex].avaliacoes[avaliacaoIndex]) {
                    const registos = unidadesCurriculares[unidadeIndex].avaliacoes[avaliacaoIndex].registos || [];
                    let minutosRemovidos = 0;
                    registos.forEach(registo => {
                        minutosRemovidos += parseInt(registo.duracao, 10);
                    });
        
                    unidadesCurriculares[unidadeIndex].minutos -= minutosRemovidos;
                    unidadesCurriculares[unidadeIndex].avaliacoes.splice(avaliacaoIndex, 1);
                    localStorage.setItem('unidadesCurriculares', JSON.stringify(unidadesCurriculares));
                    displayAvaliacoes(unidadeIndex);
                }
            }
        };
        
        function populateAnoSelect() {
            const anoSelect = document.getElementById('unidade-ano');
            const optionAno = document.createElement('option');
            optionAno.value = '';
            optionAno.textContent = 'Ano Curricular';
            anoSelect.appendChild(optionAno);
            for (let ano = 2024; ano >= 1950; ano--) {
                const option = document.createElement('option');
                option.value = ano;
                option.textContent = ano;
                anoSelect.appendChild(option);
            }
        }

            
        function addNewRecord() {
            console.log("addNewRecord function called");

            const dayInput = document.getElementById('record-day').value;
            const startTimeInput = document.getElementById('record-start-time').value;
            const durationInput = document.getElementById('record-duration').value;

            console.log("Day Input:", dayInput);
            console.log("Start Time Input:", startTimeInput);
            console.log("Duration Input:", durationInput);

            if (!dayInput || !startTimeInput || !durationInput) {
                alert('Por favor, preencha todos os campos do registo.');
                return;
            }

            const unidadesCurriculares = JSON.parse(localStorage.getItem('unidadesCurriculares')) || [];

            if (currentUnidadeIndex !== null && currentAvaliacaoIndex !== null) {
                const newRecord = {
                    dia: dayInput,
                    horaInicio: startTimeInput,
                    duracao: durationInput
                };

                const minutos = parseInt(durationInput, 10); 

                if (!unidadesCurriculares[currentUnidadeIndex].avaliacoes[currentAvaliacaoIndex].registos) {        //se avaliacao selecionada nao tiver registor, inicializa com uma array vazia
                    unidadesCurriculares[currentUnidadeIndex].avaliacoes[currentAvaliacaoIndex].registos = [];
                }

                unidadesCurriculares[currentUnidadeIndex].avaliacoes[currentAvaliacaoIndex].registos.push(newRecord);

                //atualiza total dos minutos da UC 
                unidadesCurriculares[currentUnidadeIndex].avaliacoes[currentAvaliacaoIndex].minutos = parseInt(unidadesCurriculares[currentUnidadeIndex].avaliacoes[currentAvaliacaoIndex].minutos, 10) + minutos;
                unidadesCurriculares[currentUnidadeIndex].minutos = parseInt(unidadesCurriculares[currentUnidadeIndex].minutos, 10) + minutos;

                const avaliacaoItem = document.querySelector(`.avaliacao-name[data-avaliacao-index="${currentAvaliacaoIndex}"]`);  //finds the HTML element that represents the evaluation with the current index
                const totalMinutesElement = avaliacaoItem.nextElementSibling; //finds the next element,this next element is expected to be total minutes spent
                totalMinutesElement.textContent = `Minutos gastos: ${unidadesCurriculares[currentUnidadeIndex].avaliacoes[currentAvaliacaoIndex].minutos}`; //shows updated minutes spent

                localStorage.setItem('unidadesCurriculares', JSON.stringify(unidadesCurriculares));

                alert('Registo adicionado com sucesso!');

                document.getElementById('record-form').reset();
            } else {
                console.log("Current indices are null");
            }
        }

        document.getElementById('add-button').addEventListener('click', addUnidadeCurricular);

        document.getElementById('add-avaliacao-button').addEventListener('click', addAvaliacao);

        document.getElementById('add-record-button').addEventListener('click', addNewRecord);

        populateAnoSelect();

        displayUnidadesCurriculares();
    });
