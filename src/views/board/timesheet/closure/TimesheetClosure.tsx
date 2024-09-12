import { NextSeo } from "next-seo";
import Button from "@italodeandra/ui/components/Button";
import { ArrowLeftIcon, PrinterIcon } from "@heroicons/react/20/solid";
import Routes from "../../../../Routes";
import { timesheetTimeClosureGetApi } from "../../../../pages/api/timesheet/time-closure/get";
import { formatMoney } from "../../../../utils/formatMoney";
import dayjs from "dayjs";
import formatTime from "@italodeandra/ui/utils/formatTime";
import { UserAvatarAndName } from "../../../../components/UserAvatarAndName";

function timeToMoney(time: number, hourlyRate: number) {
  return (time / 1000 / 60 / 60) * hourlyRate;
}

export function TimesheetClosure({
  boardId,
  timesheetId,
}: {
  boardId: string;
  timesheetId: string;
}) {
  const timesheetTimeClosureGet = timesheetTimeClosureGetApi.useQuery({
    _id: timesheetId,
  });

  const title = timesheetTimeClosureGet.data
    ? `Fechamento de horas ${timesheetTimeClosureGet.data.closure.project.name} ${dayjs(
        timesheetTimeClosureGet.data.closure.createdAt,
      ).format("MM/YYYY")}`
    : undefined;

  const totalToPay = timesheetTimeClosureGet.data
    ? timeToMoney(
        timesheetTimeClosureGet.data.closure.totalTime,
        timesheetTimeClosureGet.data.closure.hourlyRate,
      )
    : 0;

  return (
    <>
      <div className="mx-auto flex min-h-screen w-full max-w-[21cm] flex-col gap-2.5 p-5 font-mono text-zinc-50 print:max-w-full print:text-zinc-950">
        <div className="-mx-2 flex justify-between gap-2 font-sans print:hidden">
          <Button
            variant="text"
            size="sm"
            leading={<ArrowLeftIcon />}
            href={Routes.TimesheetList(boardId)}
          >
            Voltar para o Tasks
          </Button>
          <Button
            variant="text"
            size="sm"
            leading={<PrinterIcon />}
            onClick={window.print}
          >
            Imprimir
          </Button>
        </div>
        {timesheetTimeClosureGet.data && (
          <>
            <NextSeo title={title} titleTemplate="%s - Majapi" />
            <div className="flex items-center justify-between">
              <div className="font-medium leading-[normal]">{title}</div>
              <div className="flex items-center gap-1 text-zinc-400 print:text-zinc-600">
                <div className="font-sans text-2xl leading-none">マ</div>
                <div className="text-sm leading-[normal]">Majapi</div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-1 self-stretch">
              <div className="self-stretch text-sm font-normal leading-[normal] text-zinc-100 print:text-zinc-900">
                Segue abaixo o relatório detalhado das atividades desenvolvidas
                e o respectivo tempo dedicado durante o período de
                desenvolvimento, referente ao mês de setembro de 2024. Este
                documento visa fornecer transparência e acompanhamento das
                entregas realizadas para o projeto em andamento.
              </div>
            </div>
            <table contentEditable>
              <thead>
                <tr className="text-sm text-zinc-400 [&_th]:text-left [&_th]:font-medium">
                  <th>Descrição</th>
                  <th>Projeto</th>
                  <th className="!text-right">Horas</th>
                </tr>
              </thead>
              <tbody>
                {timesheetTimeClosureGet.data.timesheets.map((timesheet) => (
                  <tr key={timesheet._id}>
                    <td>{timesheet.description}</td>
                    <td>{timesheet.project}</td>
                    <td className="text-right">{formatTime(timesheet.time)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="pt-2">
                <tr className="border-t border-t-zinc-500 [&_th]:text-left [&_th]:font-medium">
                  <td>Total horas</td>
                  <td />
                  <td className="text-right">
                    {formatTime(timesheetTimeClosureGet.data.closure.totalTime)}
                  </td>
                </tr>
                <tr className="[&_th]:text-left [&_th]:font-medium">
                  <td>Valor por hora</td>
                  <td />
                  <td className="text-right">
                    {formatMoney(
                      timesheetTimeClosureGet.data.closure.hourlyRate,
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="flex-1" />
            <div className="rounded-lg bg-zinc-900 p-2 print:hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-zinc-400 [&_th]:text-left [&_th]:font-medium">
                    <th>Usuário</th>
                    <th className="!text-right">Horas</th>
                    <th className="!text-right">Cota</th>
                  </tr>
                </thead>
                <tbody>
                  {timesheetTimeClosureGet.data.users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <UserAvatarAndName {...user} />
                      </td>
                      <td className="text-right">{formatTime(user.time)}</td>
                      <td className="text-right">
                        {formatMoney(
                          timeToMoney(
                            user.time,
                            timesheetTimeClosureGet.data.closure.hourlyRate,
                          ),
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between text-lg">
              <div className="font-medium">Total a pagar</div>
              <div className="text-right">{formatMoney(totalToPay)}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm text-zinc-500">
                Este documento foi gerado automaticamente e não necessita de
                assinatura para validação.
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
