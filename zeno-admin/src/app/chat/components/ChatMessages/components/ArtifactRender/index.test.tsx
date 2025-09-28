import { render, screen } from "@testing-library/react";
import ChatArtifactRenderer from "./index";

jest.mock("@mui/x-charts", () => ({
  BarChart: (props: Record<string, unknown>) => (
    <div data-testid="bar-chart" data-color={(props.series as any)?.[0]?.color} />
  ),
  LineChart: (props: Record<string, unknown>) => (
    <div data-testid="line-chart" data-color={(props.series as any)?.[0]?.color} />
  ),
  PieChart: (_props: Record<string, unknown>) => <div data-testid="pie-chart" />,
}));

describe("ChatArtifactRenderer", () => {
  it("renders text artifact", () => {
    render(<ChatArtifactRenderer artifactType="text" artifactData={{}} text="Hello World" />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders bar chart when artifactType=chart and chart_type=bar with correct color", () => {
    const data = { x: ["A", "B"], y: [10, 20], chart_type: "bar" };
    render(<ChatArtifactRenderer artifactType="chart" artifactData={data} />);
    const barChart = screen.getByTestId("bar-chart");
    expect(barChart).toBeInTheDocument();
    expect(barChart).toHaveAttribute("data-color", "#60a5fa"); 
  });

  it("renders line chart by default with correct color", () => {
    const data = { x: ["A", "B"], y: [5, 15] };
    render(<ChatArtifactRenderer artifactType="chart" artifactData={data} />);
    const lineChart = screen.getByTestId("line-chart");
    expect(lineChart).toBeInTheDocument();
    expect(lineChart).toHaveAttribute("data-color", "#3b82f6"); 
  });

  it("renders pie chart when chart_type=pie", () => {
    const data = { x: ["A", "B"], y: [3, 7], chart_type: "pie" };
    render(<ChatArtifactRenderer artifactType="chart" artifactData={data} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renders invalid chart data fallback when x or y missing", () => {
    const data = { x: ["A"], y: [] }; 
render(<ChatArtifactRenderer artifactType="chart" artifactData={data} />);
    render(<ChatArtifactRenderer artifactType="chart" artifactData={data} />);
    expect(screen.getByText(/Invalid chart data/i)).toBeInTheDocument();
  });

  it("renders table when columns and rows provided", () => {
    const tableData = {
      columns: ["Name", "Age"],
      rows: [["Alice", 25], ["Bob", 30]],
    };
    render(<ChatArtifactRenderer artifactType="table" artifactData={tableData} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("renders table using x and y when provided", () => {
    const tableData = { x: ["Jan", "Feb"], y: [100, 200], title: "Monthly Data" };
    render(<ChatArtifactRenderer artifactType="table" artifactData={tableData} />);
    expect(screen.getByText("Monthly Data")).toBeInTheDocument();
    expect(screen.getByText("Jan")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it("renders nothing when table data is missing required fields", () => {
    const { container } = render(<ChatArtifactRenderer artifactType="table" artifactData={{}} />);
    expect(container.firstChild).toBeNull();
  });
});