import { ResponsiveLine } from "@nivo/line";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const LineChartPresion = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dataTemp, setDataTemp] = useState(false);

  const datosFetch = async () => {

    const response = await fetch('https://api.thingspeak.com/channels/2209558/fields/3.json?results=13');
    const data = await response.json();
    setDataTemp(data.feeds);

    const intervalo = setInterval(async () => {

      const responses = await fetch('https://api.thingspeak.com/channels/2209558/fields/3.json?results=13');
      const datas = await responses.json();
      if (datas.feeds !== dataTemp)
        setDataTemp(datas.feeds);
    }, 5000);
    return () => clearInterval(intervalo);
  };
  useEffect(() => {
    datosFetch(); // Llamada a la función al cargar el componente
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {dataTemp && < ResponsiveLine
        data={
          [
            {
              id: "Presion",
              color: tokens("dark").redAccent[200],
              data: dataTemp.map(singleData => {
                const fechaUTC = new Date(singleData.created_at);
                const fechaLocal = fechaUTC.toLocaleTimeString([], { timeStyle: 'medium' });
                const result = {
                  x: fechaLocal,
                  y: singleData.field3
                }
                return (
                  result
                )
              })
            }
          ]
        }
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
          tooltip: {
            container: {
              color: colors.primary[500],
            },
          },
        }
        }
        colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        animate={false}
        curve="linear"
        motionConfig="gentle"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 3,
          tickPadding: 10,
          tickRotation: -45,
          legend: isDashboard ? undefined : "transportation", // added
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickValues: 3,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "count", // added
          legendOffset: -40,
          legendPosition: "middle",
        }}
        enableGridX={false}
        enableGridY={false}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={- 12}
        useMesh={true}
        legends={
          [
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
      />
      }
    </>
  );
};

export default LineChartPresion;
