import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LunchSchedule() {
  const [employees, setEmployees] = useState([
    { id: "1", name: "John Doe", lunchTime: "12:00 PM", status: "Available" },
    { id: "2", name: "Jane Smith", lunchTime: "12:30 PM", status: "Available" },
    { id: "3", name: "Mike Johnson", lunchTime: "1:00 PM", status: "Available" },
  ]);
  const [newName, setNewName] = useState("");
  const [newLunchTime, setNewLunchTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [messageOfTheDay, setMessageOfTheDay] = useState("Welcome to the Lunch Schedule!");
  const maxLunchCapacity = 4;

  const updateStatus = (id, newStatus) => {
    setEmployees((prev) => {
      const lunchCount = prev.filter(emp => emp.status === "At Lunch").length;
      if (newStatus === "At Lunch" && lunchCount >= maxLunchCapacity) {
        setErrorMessage("Cannot go on lunch. Maximum capacity reached.");
        setTimeout(() => setErrorMessage(""), 3000);
        return prev;
      }
      return prev.map((emp) => emp.id === id ? { ...emp, status: newStatus } : emp);
    });
  };

  const updateLunchTime = (id, newTime) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, lunchTime: newTime } : emp
      )
    );
  };

  const addEmployee = () => {
    if (newName && newLunchTime) {
      setEmployees((prev) => [
        ...prev,
        { id: Date.now().toString(), name: newName, lunchTime: newLunchTime, status: "Available" },
      ]);
      setNewName("");
      setNewLunchTime("");
    }
  };

  const removeEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedEmployees = Array.from(employees);
    const [movedItem] = reorderedEmployees.splice(result.source.index, 1);
    reorderedEmployees.splice(result.destination.index, 0, movedItem);
    setEmployees(reorderedEmployees);
  };

  const sortedEmployees = [...employees].sort((a, b) =>
    new Date(`1970/01/01 ${a.lunchTime}`) - new Date(`1970/01/01 ${b.lunchTime}`)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-300">
      <h2 className="text-2xl font-bold mb-4 text-center">Lunch Schedule</h2>
      <div className="text-lg font-semibold text-center mb-4 p-2 bg-blue-100 border border-blue-300 rounded-lg">
        <Input type="text" value={messageOfTheDay} onChange={(e) => setMessageOfTheDay(e.target.value)} className="w-full text-center" />
      </div>
      {errorMessage && <div className="text-red-600 mb-2 font-bold text-center">{errorMessage}</div>}
      <div className="mb-4 flex space-x-2 w-full">
        <Input type="text" placeholder="Employee Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1" />
        <Input type="text" placeholder="Lunch Time" value={newLunchTime} onChange={(e) => setNewLunchTime(e.target.value)} className="flex-1" />
        <Button onClick={addEmployee}>Add</Button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="employees">
          {(provided) => (
            <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden" {...provided.droppableProps} ref={provided.innerRef}>
              <thead>
                <tr className="bg-blue-600 text-white text-left">
                  <th className="p-3 w-1/4">Name</th>
                  <th className="p-3 w-1/4">Status</th>
                  <th className="p-3 w-1/4">Lunch/Break Time</th>
                  <th className="p-3 w-1/4">Actions</th>
                  <th className="p-3">Remove</th>
                </tr>
              </thead>
              <tbody className="bg-gray-100 divide-y divide-gray-300">
                {employees.map((emp, index) => (
                  <Draggable key={emp.id} draggableId={emp.id} index={index}>
                    {(provided) => (
                      <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white hover:bg-gray-200">
                        <td className="p-3">{emp.name}</td>
                        <td className={`p-3 ${emp.status === "Available" ? "text-green-600" : "text-red-600"}`}>{emp.status}</td>
                        <td className="p-3">
                          <Input type="text" className="w-24" value={emp.lunchTime} onChange={(e) => updateLunchTime(emp.id, e.target.value)} />
                        </td>
                        <td className="p-3 space-x-2">
                          <Button variant="outline" onClick={() => updateStatus(emp.id, "Available")}>Available</Button>
                          <Button variant="outline" onClick={() => updateStatus(emp.id, "On Break")}>On Break</Button>
                          <Button variant="outline" onClick={() => updateStatus(emp.id, "At Lunch")}>At Lunch</Button>
                        </td>
                        <td className="p-3">
                          <Button variant="destructive" onClick={() => removeEmployee(emp.id)}>Remove</Button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
