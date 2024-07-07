import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/components/ui/loader";
import { useFeedbackContainers } from "@/context/feedback-context";
import { countContainersByMonth, countFeedbackByMonth } from "@/utils/feedback";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { convertTimestampToDate } from "@/utils/time";

function Dashboard() {
  const { feedbackContainers, loading, feedback } = useFeedbackContainers();

  const containersData = countContainersByMonth(feedbackContainers);
  const feedbackData = countFeedbackByMonth(feedback);

  const filteredFeedback = feedback.slice(0, 10);


  const chartConfig = {
    containers: {
      label: "Containers",
      color: "#DC2627",
    },
    feedback: {
      label: "Feedback",
      color: "#DC2627",
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader variant="secondary" />
      </div>
    );
  }

  return (
    <div>
      <h3>Dashboard</h3>
      <br />
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="col-span-3 border rounded-md p-5">
          <p>Feedback Containers</p>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={containersData}>
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <CartesianGrid vertical={false} />
              <Bar
                dataKey="containers"
                fill="var(--color-containers)"
                radius={1}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="col-span-3 border rounded-md p-5">
          <p>Feedback</p>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={feedbackData}>
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <CartesianGrid vertical={false} />
              <Bar dataKey="feedback" fill="var(--color-feedback)" radius={1} />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="col-span-3 lg:col-span-6 border rounded-md p-5">
          <p>Recent Feedback</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="table-cell text-nowrap">ID</TableHead>
                <TableHead className="table-cell text-nowrap">Name</TableHead>
                <TableHead className="table-cell text-nowrap">
                  Feedback
                </TableHead>
                <TableHead className="table-cell text-nowrap">
                  Created At
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedback.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell className="table-cell text-nowrap">
                    {feedback.id}
                  </TableCell>
                  <TableCell className="table-cell text-nowrap">
                    {feedback.name}
                  </TableCell>
                  <TableCell className="table-cell text-nowrap">
                    {feedback.feedback}
                  </TableCell>
                  <TableCell className="table-cell text-nowrap">
                    {convertTimestampToDate(feedback.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
