import { useState } from "react";
import axios from "axios";

function App() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await axios.post("http://localhost:5000/api/analyze", {
        transcript,
      });

      setResult(response.data);
    } catch (error) {
      console.log(error);
alert(
  error?.response?.data?.error ||
  "Analysis failed"
);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold mb-8">
          Supervisor Feedback Analyzer
        </h1>

        {/* Transcript Input */}

        <div>
          <label className="block text-lg font-semibold mb-3">
            Supervisor Transcript
          </label>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full h-72 border rounded-xl p-4"
            placeholder="Paste supervisor transcript here..."
          />
        </div>

        {/* Button */}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`
    mt-6 px-8 py-4 rounded-xl text-lg text-white
    ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"}
  `}
        >
          {loading ? "Analyzing Transcript..." : "Run Analysis"}
        </button> 

        {!result && !loading && (
  <p className="mt-6 text-gray-500">
    Paste a supervisor transcript and run AI analysis.
  </p>
)}


        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-xl">
  <strong>AI Draft Analysis:</strong> 
  This output is AI-generated and should be reviewed by a psychology intern before final use.
</div>
        {/* Result */}

        {result && ( 
          
          <div className="mt-10 space-y-8">
            {/* Evidence */}

            <section className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-5">Extracted Evidence</h2>

              <div className="space-y-4">
               {Array.isArray(result.evidence) &&
  result.evidence.map((item, index) => (
                  <div key={index} className="border bg-white p-4 rounded-lg">
                    <p className="italic">"{item.quote}"</p>

                    <span
                      className={`
                      inline-block mt-3 px-3 py-1 rounded-full text-sm
                      ${
                        item.tag === "positive"
                          ? "bg-green-100 text-green-700"
                          : item.tag === "negative"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                      }
                    `}
                    >
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </section>  

             

            {/* Score */}

            <section className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-5">Rubric Score</h2>

              <div className="flex items-center gap-6">
                <div className="text-6xl font-bold">
                  {result.score?.value}/10
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {result.score?.justification}
                </p>
              </div>
            </section>

            {/* KPI Mapping */}

            <section className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-5">KPI Mapping</h2>

              <div className="space-y-4">
                {result.kpi_mapping?.map((item, index) => (
                  <div key={index} className="bg-white border p-4 rounded-lg">
                    <h3 className="font-bold text-lg">{item.kpi}</h3>

                    <p className="text-gray-700 mt-2">{item.reason}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Gap Analysis */}

            <section className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-5">Gap Analysis</h2>

              <ul className="list-disc ml-6 space-y-3">
                {result.gap_analysis?.map((gap, index) => (
                  <li key={index}>{gap}</li>
                ))}
              </ul>
            </section>

            {/* Questions */}

            <section className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-5">
                Suggested Follow-up Questions
              </h2>

              <ul className="list-disc ml-6 space-y-3">
                {result.follow_up_questions?.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
