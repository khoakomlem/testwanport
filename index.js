#!/usr/bin/env node
import chalk from "chalk";
import fetch from "node-fetch";
import ora from "ora";

const ports = process.argv.slice(2);
const spinner = ora(`Checking ports: ${ports.join(", ")} . . .`).start();
Promise.all(
	ports.map(
		port =>
			new Promise(resolve => {
				{
					if (port < 0 || port > 1e5) {
						console.log(`Invalid port ${port}!`);
						return resolve(false);
					}
					fetch("https://www.portchecktool.com/", {
						headers: {
							"content-type": "application/x-www-form-urlencoded"
						},
						body: `port=${port}&submit=Check+your+port`,
						method: "POST"
					})
						.then(async data => {
							const body = await data.text();
							resolve(body.includes("Success!"));
						})
						.catch(() => console.log("Error internet connection!"));
				}
			})
	)
).then(results => {
	spinner.stop();
	let res = "";
	for (let i = 0; i < ports.length; i++)
		if (!results[i]) res += chalk.red(`${ports[i]} CLOSE\n`);
	for (let i = 0; i < ports.length; i++)
		if (results[i]) res += chalk.green(`${ports[i]} OPEN\n`);
	console.log(res);
});
