import { useEffect, useState } from "react";
import axios from "axios";

type Official = {
  _id: string;
  name: string;
  position: string;
  imageUrl?: string | null;
};

const About = () => {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const res = await axios.get(
          "https://barangay-portal-server.onrender.com/api/admin/officials"
        );
        setOfficials(res.data);
      } catch (err) {
        console.error("Error fetching officials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOfficials();
  }, []);

  return (
    <div className="p-6">
      {/* HEADER */}
      <h1 className="font-extrabold text-2xl mb-6 border-b-4 border-[#62DC87] inline-block">
        ABOUT BARANGAY IBA
      </h1>

      {/* INTRO */}
      <section className="bg-white shadow-md rounded-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <img
            src="/background-1.png"
            alt="Barangay Iba"
            className="w-full lg:w-1/3 rounded-md object-cover shadow-md"
          />
          <div className="flex-1 text-gray-800">
            <h2 className="font-bold text-xl mb-3">Welcome to Barangay Iba</h2>
            <p className="text-justify leading-relaxed">
              Barangay Iba is a peaceful and growing community located in Silang, Cavite.
              It is known for its strong sense of unity, rich culture, and commitment
              to improving the lives of its residents. With a population of over 5,000
              people, Barangay Iba continues to develop while preserving its local
              traditions and values.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-md p-6">
          <h3 className="text-lg font-bold mb-3 text-[#62DC87]">MISSION</h3>
          <p className="text-gray-700 leading-relaxed">
            To promote transparency, unity, and active participation among residents
            while delivering quality services that improve community welfare and
            sustainability.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-md p-6">
          <h3 className="text-lg font-bold mb-3 text-[#62DC87]">VISION</h3>
          <p className="text-gray-700 leading-relaxed">
            A progressive, safe, and united Barangay that fosters inclusive growth,
            environmental care, and citizen empowerment for future generations.
          </p>
        </div>
      </section>

      {/* HISTORY */}
      <section className="bg-white shadow-md rounded-md p-6 mb-8">
        <h3 className="text-lg font-bold mb-3 text-[#62DC87]">HISTORY</h3>
        <p className="text-gray-700 leading-relaxed">
          Barangay Iba has a long-standing history as one of the early settlements in
          Silang. The name "Iba" comes from the Iba tree, which was abundant in the
          area. Over time, the barangay has transformed into a modern yet peaceful
          community, balancing progress and tradition.
        </p>
      </section>

      {/* OFFICIALS */}
      <section className="bg-white shadow-md rounded-md p-6">
        <h3 className="text-lg font-bold mb-4 text-[#62DC87]">BARANGAY OFFICIALS</h3>

        {loading ? (
          <p className="text-gray-500">Loading officials...</p>
        ) : officials.length === 0 ? (
          <p className="text-gray-500">No officials added yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {officials.map((official) => (
              <div
                key={official._id}
                className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center hover:shadow-md transition"
              >
                <img
                  src={official.imageUrl || "/samplePic.png"}
                  alt={official.name}
                  className="w-24 h-24 mx-auto rounded-full object-cover mb-3"
                  onError={(e) => (e.currentTarget.src = "/samplePic.png")}
                />
                <h4 className="font-bold text-gray-800">{official.name}</h4>
                <p className="text-sm text-gray-600">{official.position}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default About;
