import * as fs from 'fs';

class MarkovChain {
    // maps current word to the next word and marks its transition count
    #chain = new Map<string, Map<string, number>>();

    // maps the current word to the total number of transitions from that word
    #totals = new Map<string, number>();

    /**
     * Trains the model using an array of sequential string tokens
     */
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

    /**
     * Reads a CSV file where each line is a separate comma-separated word stream
     */
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

    /**
     * Exports the internal frequency statistics matrix to a CSV file
     */
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

    /**
     * Predicts the next word given a current word
     */
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
