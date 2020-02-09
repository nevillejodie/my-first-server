const http = require('http');
const db = require('./database_queries');

const s = http.createServer(async (req, res) => {
    switch (req.url) {
        case '/create.html':
            res.writeHead(200, { 'Content-Type': 'text/html' })
            return res.end(`
<!doctype html>
<html>
    <head>
        <title>Create a person</title>
        <style>
            * { font-family: arial; font-size: 40px }
        </style>
    </head>
    <body>
        <table>
            <tr>
                <td>Name:</td>
                <td><input type="text" id="name" /></td>
            </tr>
            <tr>
                <td>Twitter Handle:</td>
                <td><input type="text" id="twitter_handle" /></td>
            </tr>
            <tr>
                <td>Favourite Language:</td>
                <td>
                    <select id="fave_lang">
                        <option value="JavaScript">JavaScript</option>
                        <option value="Java">Java</option>
                        <option value="SQL">SQL</option>
                        <option value="Go">Go</option>
                        <option value="PHP">PHP</option>
                        <option value="Ada">Ada</option>
                    <select>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <button onclick="savePerson()">Save</button>
                </td>
            </tr>
        </table>
        <script>
        function savePerson() {
            const name = document.querySelector('#name').value;
            const twitterHandle = document.querySelector('#twitter_handle').value;
            const favouriteLanguage = document.querySelector('#fave_lang').value;

            fetch('http://localhost:8888/person', {
                method: 'post',
                body: JSON.stringify({ name, twitterHandle, favouriteLanguage }),
            }).then(() => {
                console.log('and we are done')
                window.location.href = '/list.html';
            }).catch(err => console.error(err));
        }
        </script>
    </body>
</html>
`)
        case '/list.html':
            res.writeHead(200, { 'Content-Type': 'text/html' })
            let response = `<!doctype html><html><head><title>List persons</title><style>* { font-family: arial; font-size: 40px }</style></head><body><table><tr><th>ID</th><th>Name</th><th>Twitter Handle</th><th>Favourite Language</th></tr>`;

            try {
                const results = await db.getAllPersons();

                results.forEach(person => {
                    response += `<tr>
                        <td>${person.id}</td>
                        <td>${person.name}</td>
                        <td>${person.twitter}</td>
                        <td>${person.lang}</td>
                        <td><button onclick="deletePerson(${person.id})">Delete</button></td>
                    </tr>`;
                });

                response += '</table>';
                response += `
                <script>
                function deletePerson(id) {
                    fetch('http://localhost:8888/person', {
                        method: 'delete',
                        body: JSON.stringify({ id })
                    }).then(res => {
                        window.location.reload();
                    }).catch(err => console.error(err));
                }
                </script>`;

                response += '</body></html>';

                return res.end(response);
            } catch (e) {
                res.writeHead(500);
                return res.end();
            }
        case '/favicon.ico':
            res.writeHead(200);
            return res.end();
        case '/person':
            let body = [];
            return req.on('data', chunk => {
                body.push(chunk.toString());
            }).on('end', async () => {
                body = JSON.parse(body.join(''));

                switch (req.method) {
                case 'DELETE':
                    try {
                        const success = await db.deletePerson(body.id);
                        res.writeHead(200);
                    } catch (e) {
                        res.writeHead(500);
                    }

                    return res.end();
                case 'POST':
                    try {
                        const id = await db.savePerson(body.name, body.twitterHandle, body.favouriteLanguage);
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ id }));
                    } catch (e) {
                        res.writeHead(500);
                        return res.end();
                    }
                }
            });
        default:
            // No route matched so send back an
            // HTTP 404 Not Found.
            res.writeHead(404)
            res.end();
    }
});

s.listen(8888);
