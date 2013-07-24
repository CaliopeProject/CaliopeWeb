function BoardCtrl($scope) {
    $scope.columns = [
        {
            name: 'To Do', 
            notes: [
                {description: 'Estrutura de testes'},
                {description: 'Adicionar colunas dinamicamente'},
                {description: 'Colunas com altura de 100% em relação a janela do navegador'},
                {description: 'Drag and Drop entre colunas'}
            ]
        },
        {
            name: 'Doing', 
            notes: [
                {description: 'Estilo (CSS) para as notas'}
            ]
        },
        {
            name: 'Done', 
            notes: [
                {description: 'Exibir todas as colunas com a mesma largura'},
                {description: 'Listar colunas dinamicamente'},
                {description: 'Exibir notas (post-its)'}
            ]
        }





    ];
};
