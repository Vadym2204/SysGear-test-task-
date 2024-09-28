const data = require("./example.json");

function generateSequences(questions, index = 0, currentSequence = []) {
  if (index >= questions.length) {
    return [currentSequence];
  }

  const currentQuestion = questions[index];
  const questionText = Object.keys(currentQuestion)[0];
  const options = currentQuestion[questionText];
  const sequences = [];

  if (questionText === "Are you planning on getting married next year?") {
    // Special case: combine "Yes" and "No" into "Yes/No"
    const newSequence = [
      ...currentSequence,
      { [questionText]: "Yes/No" }
    ];
    sequences.push(...generateSequences(questions, index + 1, newSequence));
  } else {
    for (const option of options) {
      const newSequence = [
        ...currentSequence,
        { [questionText]: option }
      ];
      sequences.push(...generateSequences(questions, index + 1, newSequence));
    }
  }

  return sequences;
}

export const testQuestioner = () => {
  const allSequences = generateSequences(data);
  
  // Filter sequences to match the expected format
  return allSequences.filter(seq => 
    seq.length === 2 && 
    seq[0]["What is your marital status?"] === "Single" && 
    seq[1]["Are you planning on getting married next year?"] === "Yes/No"
  );
};