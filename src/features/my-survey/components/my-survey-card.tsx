import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type MySurveySummary } from "@/features/my-survey/mocks/my-surveys.mock";
import { MY_SURVEY_MESSAGES } from "@/features/my-survey/my-survey-messages";
import { cn } from "@/lib/utils";

type SurveyProgressStatus = keyof typeof MY_SURVEY_MESSAGES.statusLabels;

const STATUS_BADGE_VARIANT = {
  recruiting: "outline",
  goalReached: "default",
  closed: "status",
} as const satisfies Record<SurveyProgressStatus, string>;

function getSurveyProgressStatus(survey: MySurveySummary): SurveyProgressStatus {
  if (survey.status === "CLOSED") return "closed";
  return survey.confirmedRespondentCount >= survey.targetRespondentCount
    ? "goalReached"
    : "recruiting";
}

export function MySurveyCard({ survey }: { survey: MySurveySummary }) {
  const progressStatus = getSurveyProgressStatus(survey);
  const isClosed = progressStatus === "closed";
  const shortfall = survey.targetRespondentCount - survey.confirmedRespondentCount;

  return (
    <Card className={cn(isClosed && "border-dashed text-muted-foreground")}>
      <CardHeader>
        <CardTitle className="truncate">{survey.title}</CardTitle>
        <CardAction>
          <Badge variant={STATUS_BADGE_VARIANT[progressStatus]}>
            {MY_SURVEY_MESSAGES.statusLabels[progressStatus]}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Progress
          aria-label={survey.title}
          value={survey.confirmedRespondentCount}
          secondaryValue={survey.answeringRespondentCount}
          max={survey.targetRespondentCount}
        />
        <p className="text-caption-lg text-muted-foreground">
          {MY_SURVEY_MESSAGES.respondentProgress(
            survey.targetRespondentCount,
            survey.confirmedRespondentCount,
            survey.answeringRespondentCount,
          )}
        </p>
        {isClosed && shortfall > 0 && (
          <p className="text-caption-lg text-destructive">
            {MY_SURVEY_MESSAGES.closedShortfall(shortfall)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
