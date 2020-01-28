const express = require('express');

const server = express();

server.use(express.json());;

server.listen(process.env.PORT ||3000);


const projects = [];

/*const projects = [
  {
    id: "1",
    title: "S13",
    tasks: ["Autenticação", "Criar Rotas" ]
  },
  {
    id: "2",
    title: "Vistoria técnicas",
    tasks: ["Listar Edifições", "Criar Rotas" ]
  }
];*/

// Query params = ?teste=1
// route params = /projects/1
// Request body = { "id": 1, "name": "PSBS", "tasks": ["Nova Tarefa"]}


//Middleware que checa se o projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}


//Middleware que conta o número de requisições até agora
function logRequests(req, res, next) {

  console.count("Número de requisições");

  return next();
}

server.use(logRequests);


//Listar todos os projetos
server.get('/projects', (req,res) => {
  return res.json(projects);  
})

//Listar um projeto pelo id
//Ele está pegando o índice do array o ideal é que fosse pelo id mesmo
//Pesquisar como fazer isso
server.get('/projects/:id', (req,res) => {
  const { id } = req.params;
  return res.json(projects[id]);  
});

//Criar um novo projeto inserindo o id e título do projeto
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project);  
  return res.json(projects);
});

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id presente nos parâmetros da rota.
 */
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});


/**
 * Route params: id
 * Deleta o projeto associado ao id presente nos parâmetros da rota.
 */
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

/**
 * Route params: id;
 * Adiciona uma nova tarefa no projeto escolhido via id; 
 */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});
