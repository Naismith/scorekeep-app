import { Box, Container, getContrastRatio, styled } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  useCreateNewRowMutation,
  useGameByIdQuery,
  useUpdateRowMutation,
} from "../hooks/useGames";
import { Score } from "../models";
import { useEffect, useRef } from "react";

const TableHeader = styled("span")<{ backgroundColor?: string }>((props) => ({
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "sticky",
  top: 0,
  backgroundColor: props.backgroundColor,
  zIndex: 1,
  color:
    getContrastRatio("#ffffff", props.backgroundColor || "#000") >= 3
      ? "#fff"
      : "#000",
}));

const ScoreData = styled("span")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ScoreRow = ({
  rowIndex,
  scores,
  onLastKeyDown,
  firstRef,
  onUpdate,
}: {
  onUpdate: (row: Score) => void;
  rowIndex: number | null;
  scores: Score;
  firstRef?: React.RefObject<HTMLInputElement>;
  onLastKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
  return (
    <>
      <ScoreData>{rowIndex ? `#${rowIndex}` : null}</ScoreData>
      {scores.map((score, i) => (
        <Box
          key={i}
          ref={i === 0 ? firstRef : undefined}
          component="input"
          sx={{
            all: "unset",
            width: "100%",
            height: "100%",
            textAlign: "right",
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={(e) => {
            const newVal = Number(e.target.value);
            const clone = [...scores];
            clone[i] = newVal;
            onUpdate(clone);
          }}
          onKeyDown={i + 1 === scores.length ? onLastKeyDown : undefined}
          defaultValue={score || ""}
        />
      ))}
    </>
  );
};

const SummaryRow = ({ totals }: { totals: Score }) => (
  <>
    <ScoreData />
    {totals.map((total, i) => (
      <ScoreData sx={{ zIndex: 1 }} key={i}>
        {total}
      </ScoreData>
    ))}
  </>
);

const Grid = styled("div")<{ columns: number; rows: number }>((props) => ({
  display: "grid",
  gridTemplateColumns: `10cqi repeat(${props.columns}, minmax(25cqi, auto))`,
  gridTemplateRows: `repeat(${props.rows}, 40px)`,
  width: "100%",

  [`& > *:nth-child(${props.columns + 1}n+1)`]: {
    position: "sticky",
    left: 0,
    backgroundColor: props.theme.palette.background.default,
  },
}));

const GameDetails = () => {
  const { id = "" } = useParams();
  const { data, isSuccess } = useGameByIdQuery(id);
  const lastRowFirstCellRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: createRow, lastSuccess } = useCreateNewRowMutation(id);
  const { mutateAsync: updateRow } = useUpdateRowMutation(id);

  useEffect(() => {
    const firstElement = lastRowFirstCellRef.current;

    if (firstElement) {
      firstElement.focus();
      firstElement.scrollIntoView();
    }
  }, [lastSuccess]);

  if (!isSuccess) {
    return null;
  }

  const totals = data.scores.reduce((acc, row) => {
    row.forEach(
      (score, index) => (acc[index] = (acc[index] || 0) + (score || 0))
    );
    return acc;
  }, [] as number[]);

  return (
    <>
      <Container
        maxWidth="xs"
        sx={{
          containerType: "inline-size",
          height: "100%",
        }}
      >
        <Box
          sx={{
            overflowX: "auto",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid columns={data.players.length} rows={data.scores.length + 1}>
            <TableHeader>#</TableHeader>
            {data.players.map((player) => (
              <TableHeader key={player.id} backgroundColor={player.color}>
                {player.name}
              </TableHeader>
            ))}
            {data.scores.map((scores, i) => (
              <ScoreRow
                key={i}
                firstRef={lastRowFirstCellRef}
                onLastKeyDown={async (e) => {
                  if (i + 1 === data.scores.length && e.key === "Tab") {
                    e.preventDefault();
                    await createRow();
                  }
                }}
                onUpdate={(row) => updateRow({ rowIndex: i, row })}
                rowIndex={i + 1}
                scores={scores}
              />
            ))}
          </Grid>

          <Box flexGrow={1} />

          <Grid
            columns={data.players.length}
            rows={1}
            sx={{
              borderTop: "2px solid red",
              position: "sticky",
              bottom: 0,
            }}
          >
            <SummaryRow totals={totals} />
          </Grid>
        </Box>
        {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
      </Container>
    </>
  );
};

export default GameDetails;
