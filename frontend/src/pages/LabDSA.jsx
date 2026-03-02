
import { Link } from "react-router-dom";
import "./Lab.css";

const sortingAlgorithms = [
  { name: "Bubble Sort", value: "bubble" },
  { name: "Selection Sort", value: "selection" },
  { name: "Insertion Sort", value: "insertion" },
  { name: "Merge Sort", value: "merge" },
  { name: "Quick Sort", value: "quick" }
];

function sortArray(arr, algo) {
  let a = [...arr];
  switch (algo) {
    case "bubble":
      for (let i = 0; i < a.length - 1; i++)
        for (let j = 0; j < a.length - i - 1; j++)
          if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
      break;
    case "selection":
      for (let i = 0; i < a.length; i++) {
        let min = i;
        for (let j = i + 1; j < a.length; j++) if (a[j] < a[min]) min = j;
        [a[i], a[min]] = [a[min], a[i]];
      }
      break;
    case "insertion":
      for (let i = 1; i < a.length; i++) {
        let key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) a[j + 1] = a[j--];
        a[j + 1] = key;
      }
      break;
    case "merge":
      function mergeSort(arr) {
        if (arr.length <= 1) return arr;
        const mid = Math.floor(arr.length / 2);
        const left = mergeSort(arr.slice(0, mid));
        const right = mergeSort(arr.slice(mid));
        let result = [], i = 0, j = 0;
        while (i < left.length && j < right.length)
          result.push(left[i] < right[j] ? left[i++] : right[j++]);
        return result.concat(left.slice(i)).concat(right.slice(j));
      }
      a = mergeSort(a);
      break;
    case "quick":
      function quickSort(arr) {
        if (arr.length <= 1) return arr;
        const pivot = arr[0];
        const left = arr.slice(1).filter(x => x < pivot);
        const right = arr.slice(1).filter(x => x >= pivot);
        return quickSort(left).concat([pivot], quickSort(right));
      }
      a = quickSort(a);
      break;
    default:
      break;
  }
  return a;
}

const LabDSA = () => {
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState("bubble");
  const [output, setOutput] = useState([]);

  const handleSort = (e) => {
    e.preventDefault();
    const arr = input.split(/\s|,/).map(Number).filter(x => !isNaN(x));
    setOutput(sortArray(arr, algo));
  };

  return (
    <div className="lab-root">
      <div className="lab-header">
        <h1 className="lab-title">Sorting Experiment</h1>
        <p className="lab-desc">Enter numbers and select a sorting algorithm to see how it works.</p>
        <div style={{ marginTop: 16 }}>
          <Link to="/labs/stack" className="btn secondary" style={{ fontWeight: 600, fontSize: '1.01rem', borderRadius: 8, minWidth: 120, textAlign: 'center' }}>
            Try Stack Visualization
          </Link>
        </div>
      </div>
      <form onSubmit={handleSort} className="lab-controls">
        <label className="lab-label">
          Numbers (comma or space separated):
          <input className="lab-input" value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. 5, 2, 9, 1" />
        </label>
        <label className="lab-label">
          Algorithm:
          <select className="lab-select" value={algo} onChange={e => setAlgo(e.target.value)}>
            {sortingAlgorithms.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.name}</option>
            ))}
          </select>
        </label>
        <button className="btn primary" type="submit">Sort</button>
      </form>
      {output.length > 0 && (
        <div className="lab-output">
          <span>Sorted Output:</span>
          <span className="lab-output-value">{output.join(", ")}</span>
        </div>
      )}
    </div>
  );
};

export default LabDSA;
