import React, { useState, useEffect } from "react";
import "./AIConfig.css";

const AIConfig = ({ onClose }) => {
  const [configs, setConfigs] = useState({
    bubble: {
      correctStructure: "✅ **Correct Structure**: Your code has the basic bubble sort structure with nested loops and comparisons.",
      structureIssue: "⚠️ **Structure Issue**: Bubble sort typically uses nested loops with adjacent element comparisons.",
      outerLoop: "✅ **Outer Loop**: Correct outer loop condition to avoid unnecessary passes.",
      innerLoop: "✅ **Inner Loop**: Correct inner loop optimization to reduce comparisons.",
      swapping: "✅ **Swapping**: Good swapping implementation.",
      timeComplexity: "ℹ️ **Time Complexity**: This bubble sort has O(n²) time complexity.",
      template: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
      correctionExplanation: "Here's the corrected Bubble Sort implementation with proper nested loops and element swapping."
    },
    selection: {
      selectionLogic: "✅ **Selection Logic**: Your code identifies minimum elements correctly.",
      loopStructure: "✅ **Loop Structure**: Correct nested loop structure for selection sort.",
      timeComplexity: "ℹ️ **Time Complexity**: This selection sort has O(n²) time complexity.",
      template: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    // Swap the found minimum element with the first element
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
  return arr;
}`,
      correctionExplanation: "Here's the corrected Selection Sort implementation with proper minimum element finding and swapping."
    },
    insertion: {
      insertionLogic: "✅ **Insertion Logic**: Good implementation of insertion sort with key shifting.",
      timeComplexity: "ℹ️ **Time Complexity**: This insertion sort has O(n²) time complexity.",
      template: `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
      correctionExplanation: "Here's the corrected Insertion Sort implementation with proper key shifting and insertion."
    },
    stack: {
      operations: "✅ **Stack Operations**: Your code includes basic stack operations.",
      topAccess: "✅ **Top Access**: Good implementation of accessing the top element.",
      arrayMethods: "✅ **Array Methods**: Appropriate use of array methods for stack operations.",
      boundaryChecks: "✅ **Boundary Checks**: Good handling of empty stack conditions.",
      timeComplexity: "ℹ️ **Time Complexity**: Stack operations (push/pop) are O(1).",
      push: `function push(stack, value) {
  stack.push(value);
  return stack;
}`,
      pop: `function pop(stack) {
  if (stack.length === 0) {
    throw new Error("Stack is empty");
  }
  return stack.pop();
}`,
      peek: `function peek(stack) {
  if (stack.length === 0) {
    throw new Error("Stack is empty");
  }
  return stack[stack.length - 1];
}`,
      isEmpty: `function isEmpty(stack) {
  return stack.length === 0;
}`,
      correctionExplanation: "Here are the corrected stack operations with proper error handling and implementation."
    },
    general: {
      syntaxError: "❌ **Syntax Error**: {error}\n\nPlease fix the syntax errors before analyzing further.",
      debugCode: "⚠️ **Debug Code**: Consider removing console.log statements in production code.",
      codeLengthShort: "ℹ️ **Code Length**: Your implementation is concise, which is good!",
      codeLengthLong: "⚠️ **Code Length**: Consider simplifying your implementation for better readability.",
      variableDeclaration: "✅ **Variable Declaration**: Good use of variable declarations.",
      defaultAnalysis: "ℹ️ **Analysis**: Your code looks reasonable, but I couldn't identify specific patterns. Try running it to check correctness."
    }
  });

  const [activeTab, setActiveTab] = useState('bubble');

  useEffect(() => {
    // Load saved configurations
    const savedConfigs = localStorage.getItem('vlab_ai_configs');
    if (savedConfigs) {
      setConfigs(JSON.parse(savedConfigs));
    }
  }, []);

  const handleConfigChange = (algorithm, key, value) => {
    setConfigs(prev => ({
      ...prev,
      [algorithm]: {
        ...prev[algorithm],
        [key]: value
      }
    }));
  };

  const saveConfigs = () => {
    localStorage.setItem('vlab_ai_configs', JSON.stringify(configs));
    alert('AI configurations saved successfully!');
  };

  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all configurations to default?')) {
      localStorage.removeItem('vlab_ai_configs');
      window.location.reload();
    }
  };

  const renderConfigSection = (algorithm) => {
    if (algorithm === 'corrections') {
      return (
        <div className="config-section">
          <h3>Code Correction Templates</h3>
          <p>Configure the corrected code templates that the AI provides to students.</p>
          
          <div className="config-item">
            <label>Bubble Sort Template:</label>
            <textarea
              value={configs.bubble.template}
              onChange={(e) => handleConfigChange('bubble', 'template', e.target.value)}
              rows={12}
              placeholder="Enter corrected bubble sort code template"
            />
          </div>
          
          <div className="config-item">
            <label>Bubble Sort Correction Explanation:</label>
            <textarea
              value={configs.bubble.correctionExplanation}
              onChange={(e) => handleConfigChange('bubble', 'correctionExplanation', e.target.value)}
              rows={2}
              placeholder="Enter explanation for bubble sort correction"
            />
          </div>

          <div className="config-item">
            <label>Selection Sort Template:</label>
            <textarea
              value={configs.selection.template}
              onChange={(e) => handleConfigChange('selection', 'template', e.target.value)}
              rows={12}
              placeholder="Enter corrected selection sort code template"
            />
          </div>
          
          <div className="config-item">
            <label>Selection Sort Correction Explanation:</label>
            <textarea
              value={configs.selection.correctionExplanation}
              onChange={(e) => handleConfigChange('selection', 'correctionExplanation', e.target.value)}
              rows={2}
              placeholder="Enter explanation for selection sort correction"
            />
          </div>

          <div className="config-item">
            <label>Insertion Sort Template:</label>
            <textarea
              value={configs.insertion.template}
              onChange={(e) => handleConfigChange('insertion', 'template', e.target.value)}
              rows={12}
              placeholder="Enter corrected insertion sort code template"
            />
          </div>
          
          <div className="config-item">
            <label>Insertion Sort Correction Explanation:</label>
            <textarea
              value={configs.insertion.correctionExplanation}
              onChange={(e) => handleConfigChange('insertion', 'correctionExplanation', e.target.value)}
              rows={2}
              placeholder="Enter explanation for insertion sort correction"
            />
          </div>

          <div className="config-item">
            <label>Stack Push Function:</label>
            <textarea
              value={configs.stack.push}
              onChange={(e) => handleConfigChange('stack', 'push', e.target.value)}
              rows={4}
              placeholder="Enter corrected push function"
            />
          </div>

          <div className="config-item">
            <label>Stack Pop Function:</label>
            <textarea
              value={configs.stack.pop}
              onChange={(e) => handleConfigChange('stack', 'pop', e.target.value)}
              rows={5}
              placeholder="Enter corrected pop function"
            />
          </div>

          <div className="config-item">
            <label>Stack Peek Function:</label>
            <textarea
              value={configs.stack.peek}
              onChange={(e) => handleConfigChange('stack', 'peek', e.target.value)}
              rows={5}
              placeholder="Enter corrected peek function"
            />
          </div>

          <div className="config-item">
            <label>Stack isEmpty Function:</label>
            <textarea
              value={configs.stack.isEmpty}
              onChange={(e) => handleConfigChange('stack', 'isEmpty', e.target.value)}
              rows={3}
              placeholder="Enter corrected isEmpty function"
            />
          </div>
          
          <div className="config-item">
            <label>Stack Correction Explanation:</label>
            <textarea
              value={configs.stack.correctionExplanation}
              onChange={(e) => handleConfigChange('stack', 'correctionExplanation', e.target.value)}
              rows={2}
              placeholder="Enter explanation for stack corrections"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="config-section">
        <h3>{algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort Analysis</h3>
        {Object.entries(configs[algorithm]).map(([key, value]) => (
          <div key={key} className="config-item">
            <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
            <textarea
              value={value}
              onChange={(e) => handleConfigChange(algorithm, key, e.target.value)}
              rows={2}
              placeholder={`Enter feedback for ${key}`}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="ai-config-overlay">
      <div className="ai-config-modal">
        <div className="ai-config-header">
          <h2>AI Assistant Configuration</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="ai-config-tabs">
          <button
            className={activeTab === 'bubble' ? 'active' : ''}
            onClick={() => setActiveTab('bubble')}
          >
            Bubble Sort
          </button>
          <button
            className={activeTab === 'selection' ? 'active' : ''}
            onClick={() => setActiveTab('selection')}
          >
            Selection Sort
          </button>
          <button
            className={activeTab === 'insertion' ? 'active' : ''}
            onClick={() => setActiveTab('insertion')}
          >
            Insertion Sort
          </button>
          <button
            className={activeTab === 'stack' ? 'active' : ''}
            onClick={() => setActiveTab('stack')}
          >
            Stack
          </button>
          <button
            className={activeTab === 'general' ? 'active' : ''}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={activeTab === 'corrections' ? 'active' : ''}
            onClick={() => setActiveTab('corrections')}
          >
            Corrections
          </button>
        </div>

        <div className="ai-config-content">
          {renderConfigSection(activeTab)}
        </div>

        <div className="ai-config-actions">
          <button className="btn secondary" onClick={resetToDefault}>
            Reset to Default
          </button>
          <button className="btn primary" onClick={saveConfigs}>
            Save Configurations
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConfig;