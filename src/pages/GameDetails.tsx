import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  getContrastRatio,
  styled,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import {
  useCreateNewRowMutation,
  useFinishGameMutation,
  useGameByIdQuery,
  useUpdateRowMutation,
} from "../hooks/useGames";
import { Score } from "../models";
import { useEffect, useRef, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { GameResultsModal } from "../components/GameResultsModal";

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
  readOnly,
}: {
  readOnly: boolean;
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
          readOnly={readOnly}
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
  const [showResultsModal, setShowResultsModal] = useState(false);
  const { data, isSuccess } = useGameByIdQuery(id);
  const lastRowFirstCellRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: createRow, lastSuccess } = useCreateNewRowMutation(id);
  const { mutateAsync: updateRow } = useUpdateRowMutation(id);
  const { mutateAsync: finishGame } = useFinishGameMutation(id);

  useEffect(() => {
    if (data?.status === "finished") {
      setShowResultsModal(true);
    }
  }, [data?.status]);
  useEffect(() => {
    const firstElement = lastRowFirstCellRef.current;

    if (firstElement) {
      firstElement.focus();
      firstElement.scrollIntoView();
    }
  }, [lastSuccess]);

  if (!isSuccess || !data) {
    return null;
  }

  const totals = data.scores.reduce((acc: number[], row) => {
    row.forEach((score, index) => {
      acc[index] = (acc[index] || 0) + (score || 0);
    });
    return acc;
  }, [] as number[]);

  const handleNewRowCreation = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== "Tab") return;

    const currentRounds = data.scores.length;

    const maxScore = data.maxScore;
    const maxRoundsReached = data.countOfGameRounds === currentRounds;
    const maxScoreReached =
      maxScore !== undefined && totals.some((score) => score < maxScore);

    if (maxRoundsReached || maxScoreReached) {
      await finishGame();
      return;
    }

    e.preventDefault();
    await createRow();
  };

  return (
    <>
      <GameResultsModal
        open={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        game={data}
      />
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            component={Link}
            to="/"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap>
              {data.title}
            </Typography>
          </Box>
          {data.status === "finished" && (
            <Button
              sx={{ color: "white" }}
              onClick={() => setShowResultsModal(true)}
              variant="text"
            >
              Results
            </Button>
          )}
          {data.status === "in-progress" && (
            <Button
              sx={{ color: "white" }}
              onClick={() => finishGame()}
              variant="text"
            >
              finish game
            </Button>
          )}
          <IconButton
            onClick={async () => {
              console.log("click");
            }}
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ ml: 0 }}
          >
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
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
                readOnly={data.status === "finished"}
                firstRef={lastRowFirstCellRef}
                onLastKeyDown={
                  i + 1 === data.scores.length
                    ? handleNewRowCreation
                    : undefined
                }
                onUpdate={(row) => updateRow({ rowIndex: i, row })}
                rowIndex={i + 1}
                scores={scores}
              />
            ))}
          </Grid>

          <Box flexGrow={1} />

          {data.showInterimResults && (
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
          )}
        </Box>
      </Container>
    </>
  );
};

export default GameDetails;
