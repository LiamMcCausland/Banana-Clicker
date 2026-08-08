import * as fs from 'fs';

// A MarkovChain class that can be trained with sequences of states and can predict the next state based on the current state and a random number
class MarkovChain {

    #chain = new Map<string, Map<string, number>>();
    #totals = new Map<string, number>();

    // Trains the Markov chain with a sequence of states by counting the transitions between consecutive states and storing the counts in the chain and totals maps
    train(states: string[]): void {
        for (let i = 0; i < states.length - 1; i++) {
            const current = states[i];
            const next = states[i + 1];

            // Ensure the current state exists in the chain and totals maps
            if (!this.#chain.has(current)) {
                this.#chain.set(current, new Map());
                this.#totals.set(current, 0);
            }

            // Get the transition map for the current state
            const transitions = this.#chain.get(current)!;
            const count = transitions.get(next) || 0;

            // Increment the transition count for the next state
            transitions.set(next, count + 1);

            // Increment the total transition count for the current state
            this.#totals.set(current, this.#totals.get(current)! + 1);
        }
    }

    // Parses a csv and feeds the data into the train function
    trainFromCSV(filePath: string): void {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const lines = fileContent.split(/\r?\n/);

            for (const line of lines) {
                const cleanLine = line.trim();
                if (!cleanLine) continue;

                // Split line by commas and clean up trailing spaces
                const tokens = cleanLine.split(',').map(word => word.trim());

                if (tokens.length > 1) {
                    this.train(tokens);
                }
            }
        } catch (error) {
            console.log(error instanceof Error ? error.message : error);
        }
    }

    // exports the maps to a csv file with the following columns: CurrentState, NextState, TransitionCount(Numerator), TotalTransitions(Denominator)
    exportMatrixToCSV(outputPath: string): void {
        try {
            const csvLines: string[] = ['CurrentState,NextState,TransitionCount(Numerator),TotalTransitions(Denominator)'];

            for (const [current, transitions] of this.#chain.entries()) {
                const total = this.#totals.get(current) || 0;

                for (const [next, count] of transitions.entries()) {
                    
                    const currentEscaped = `"${current}"`;
                    const nextEscaped = `"${next}"`;

                    csvLines.push(`${currentEscaped},${nextEscaped},${count},${total}`);
                }
            }

            fs.writeFileSync(outputPath, csvLines.join('\n'), 'utf-8');
            console.log(`Successfully exported matrix to: ${outputPath}`);
        } catch (error) {
            console.log(error instanceof Error ? error.message : error);
        }
    }

    // Example predict implementation that uses a random number to select the next state based on the transition probabilities
    predict(current: string, random: number): string | null {
        let result = null
        
        // Get the transition map for the current state
        const transitions = this.#chain.get(current);

        // If there are transitions and a total count for the current state, perform weighted random selection
        if (transitions && this.#totals.get(current)) {
            const total = this.#totals.get(current)!;
            let rand = random * total;

            for (const [nextState, count] of transitions.entries()) {
                rand -= count;
                if (rand <= 0) {
                    result = nextState;
                }
            }
        }

        return result;
    }
}

const markovChain = new MarkovChain();
markovChain.trainFromCSV('training.csv');
markovChain.exportMatrixToCSV('output_matrix.csv');
