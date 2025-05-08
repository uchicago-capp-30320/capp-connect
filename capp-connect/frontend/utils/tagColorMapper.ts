// Modified from ChatGPT
// prompt: give me a js function or something that takes a keyword, and if its the first time it sees it, assigns it a random color, otherwise maps it to its already assigned color
// function that maps every unique tag to a color then continues to use the same color
// should be moved to persistent storage
export default function createTagColorMapper() {
    const keywordToColor: Record<string, string> = {};

    function getRandomColor() {
      // Generates a random hex color, e.g. "#a3e12f"
      return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }

    return function(keyword: string) {
      if (!keywordToColor[keyword]) {
        keywordToColor[keyword] = getRandomColor();
      }
      return keywordToColor[keyword];
    };
  }
