import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import random from 'random';

const path = './data.json';
const git = simpleGit();

const markCommitOnDate = async (targetDate) => {
    const formattedDate = targetDate.format();
    const data = { lastCommitDate: formattedDate };

    await jsonfile.writeFile(path, data);
    await git.add([path]);
    await git.commit(`Contribution: ${formattedDate}`, { '--date': formattedDate });
};

const populateStrictWindow = async () => {
    console.log("Starting on a fresh slate...");

    // Explicit date boundaries
    let currentDay = moment('2026-05-22');
    const stopDate = moment('2025-11-14');

    while (currentDay.isSameOrAfter(stopDate)) {
        const shouldCommit = random.float(0, 1) < 0.70;

        if (shouldCommit) {
            const commitCount = random.int(1, 5);

            for (let i = 0; i < commitCount; i++) {
                const randomizedTime = currentDay.clone()
                    .hour(random.int(9, 18))
                    .minute(random.int(0, 59));

                await markCommitOnDate(randomizedTime);
            }
        }
        currentDay.subtract(1, 'd');
    }

    console.log("Overwriting remote GitHub repository history...");
    // Using force push (-f) to clear out the old graph layout entirely
    await git.push(['-u', 'origin', 'main', '-f']);
    console.log("Graph perfectly aligned to your dates! Refresh your profile.");
};

populateStrictWindow();
